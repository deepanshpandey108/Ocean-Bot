import os
import re
import numpy as np
import faiss
import pandas as pd
import duckdb
from sentence_transformers import SentenceTransformer
from groq import Groq

# ✅ Fix: force Matplotlib to use non-GUI backend
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

import io
import base64

# -------------------------
# Configuration / connections
# -------------------------
DUCKDB_PATH = "app/data/argo.duckdb"
FAISS_INDEX_PATH = "app/data/argo_faiss.index"
ID_MAP_PATH = "app/data/id_map.npy"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

# Groq API key from environment
GROQ_API_KEY = ""   # <-- replace with your key
client = Groq(api_key=GROQ_API_KEY)

# Connect to DuckDB
con = duckdb.connect(DUCKDB_PATH)

# Load FAISS index and ID mapping
index = faiss.read_index(FAISS_INDEX_PATH)
id_map = np.load(ID_MAP_PATH, allow_pickle=True).tolist()

# Embedding model
embed_model = SentenceTransformer(EMBED_MODEL_NAME)

# -------------------------
# Helpers
# -------------------------
def is_generic_query(query: str) -> bool:
    """Check if the query is generic (e.g., informational, not requesting specific data)."""
    query = query.lower()
    specific_keywords = [
        'salinity', 'temperature', 'temp', 'depth', 'pressure', 'trend', 'average', 'min', 'max',
        'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
        'october', 'november', 'december', '2018', '2019', '2020', '2021', '2022', '2023',
        '2024', '2025', 'profile', 'latitude', 'longitude', 'platform'
    ]
    return not any(keyword in query for keyword in specific_keywords)

def sanitize_llm_output(text: str) -> str:
    m = re.search(r"```(?:sql)?\s*(.*?)```", text, flags=re.S | re.I)
    if m:
        sql = m.group(1).strip()
    else:
        m2 = re.search(r"(SELECT\b.*?;)", text, flags=re.S | re.I)
        if m2:
            sql = m2.group(1).strip()
        else:
            m3 = re.search(r"SELECT\b.*", text, flags=re.S | re.I)
            sql = m3.group(0).strip() if m3 else text.strip()
    sql = re.sub(r'^[\s\w\-\:\.]*?(SELECT\b)', r'\1', sql, flags=re.I)
    
    # Fix common syntax errors like missing parentheses in CAST
    sql = re.sub(r"CAST\s*([^ (]+)\.", r"CAST(\1.", sql, flags=re.I)
    sql = re.sub(r"CAST\s*([^ (]+)\s+AS", r"CAST(\1) AS", sql, flags=re.I)
    
    return sql

def get_profiles_time_type() -> str:
    try:
        desc = con.execute("DESCRIBE profiles").df()
        for _, row in desc.iterrows():
            if str(row['column_name']).lower() == 'time':
                return str(row['column_type']).lower()
    except Exception:
        pass
    return ""

def adjust_sql_for_time_cast(sql: str) -> str:
    time_type = get_profiles_time_type()
    if time_type and 'timestamp' not in time_type and 'date' not in time_type:
        sql = re.sub(r"EXTRACT\s*\(\s*MONTH\s+FROM\s+([^\)]+)\)", r"EXTRACT(MONTH FROM CAST(\1 AS TIMESTAMP))", sql, flags=re.I)
        sql = re.sub(r"EXTRACT\s*\(\s*YEAR\s+FROM\s+([^\)]+)\)", r"EXTRACT(YEAR FROM CAST(\1 AS TIMESTAMP))", sql, flags=re.I)
        sql = re.sub(r"\bMONTH\s*\(\s*([^\)]+)\s*\)", r"EXTRACT(MONTH FROM CAST(\1 AS TIMESTAMP))", sql, flags=re.I)
        sql = re.sub(r"\bYEAR\s*\(\s*([^\)]+)\s*\)", r"EXTRACT(YEAR FROM CAST(\1 AS TIMESTAMP))", sql, flags=re.I)
    return sql

def retrieve_context(user_query: str, k: int = 20):
    q_emb = embed_model.encode([user_query], convert_to_numpy=True)
    D, I = index.search(q_emb, k)
    retrieved = []
    ctx_lines = []
    for idx in I[0]:
        if idx < 0 or idx >= len(id_map):
            continue
        entry = id_map[idx]
        retrieved.append(entry)
        s = entry.get("summary") if isinstance(entry, dict) else str(entry)
        src = entry.get("source", "") if isinstance(entry, dict) else ""
        ctx_lines.append(f"[{src}] {s}")
    context_text = "\n".join(ctx_lines)
    return context_text, retrieved

def generate_plots(df, retrieved: list, user_query: str) -> tuple[str | None, str | None]:
    plt.style.use('ggplot')  # For better looking graphs
    
    if isinstance(df, pd.DataFrame) and not df.empty and len(df.columns) >= 2:
        try:
            x_col = df.columns[0]
            y_col = df.columns[1]
            if not pd.api.types.is_numeric_dtype(df[y_col]):
                x_col, y_col = y_col, x_col
            df = df.sort_values(x_col) if pd.api.types.is_datetime64_any_dtype(df[x_col]) else df
            x = df[x_col]
            y = df[y_col]
            
            # Line Chart
            fig, ax = plt.subplots(figsize=(8, 6))
            ax.plot(x, y, color='#007bff', marker='o', linestyle='-', linewidth=2)
            ax.set_xlabel(x_col.capitalize(), fontsize=12)
            ax.set_ylabel(y_col.capitalize(), fontsize=12)
            ax.set_title(f'{y_col.capitalize()} over {x_col.capitalize()} (Line Chart)', fontsize=14)
            ax.grid(True, linestyle='--', alpha=0.7)
            if 'depth' in y_col.lower():
                ax.invert_yaxis()
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            line_plot_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)
            
            # Step Chart
            fig, ax = plt.subplots(figsize=(8, 6))
            ax.step(x, y, color='#ff4500', where='post', linewidth=2)
            ax.plot(x, y, 'o', color='#ff4500', markersize=5)  # Add markers for clarity
            ax.set_xlabel(x_col.capitalize(), fontsize=12)
            ax.set_ylabel(y_col.capitalize(), fontsize=12)
            ax.set_title(f'{y_col.capitalize()} over {x_col.capitalize()} (Step Chart)', fontsize=14)
            ax.grid(True, linestyle='--', alpha=0.7)
            if 'depth' in y_col.lower():
                ax.invert_yaxis()
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            step_plot_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)
            
            return line_plot_base64, step_plot_base64
        except Exception as e:
            print(f"Plotting from df failed: {e}")
            # Fall back to retrieved
    
    # Fallback to retrieved if df plotting fails or df empty
    depths = []
    temps = []
    sals = []
    profile_ids = []
    pattern = r"Measurement in profile (\d+\.\d+) at depth ([\d\.]+)m: Temp ([\d\.]+) °C, Salinity ([\d\.]+) PSU"
    
    for entry in retrieved:
        if entry.get("source") == "measurements":
            summary = entry.get("summary", "")
            m = re.match(pattern, summary)
            if m:
                profile_ids.append(float(m.group(1)))
                depths.append(float(m.group(2)))
                temps.append(float(m.group(3)))
                sals.append(float(m.group(4)))
    
    if len(depths) < 2:
        return None, None
    
    # Sort by depth for meaningful line and step
    sorted_indices = np.argsort(depths)
    depths_sorted = np.array(depths)[sorted_indices]
    sals_sorted = np.array(sals)[sorted_indices] if "salinity" in user_query.lower() else np.array(temps)[sorted_indices]
    label = 'Salinity (PSU)' if "salinity" in user_query.lower() else 'Temperature (°C)'
    color = '#007bff' if "salinity" in user_query.lower() else '#ff4500'
    
    # Line Chart from retrieved
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.plot(sals_sorted if "salinity" in user_query.lower() else temps, depths_sorted, color=color, marker='o', linestyle='-', linewidth=2)
    ax.set_xlabel(label, fontsize=12)
    ax.set_ylabel('Depth (m)', fontsize=12)
    ax.invert_yaxis()
    ax.set_title('Measurements vs. Depth (Line Chart)', fontsize=14)
    ax.grid(True, linestyle='--', alpha=0.7)
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    line_plot_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    
    # Step Chart from retrieved
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.step(sals_sorted if "salinity" in user_query.lower() else temps, depths_sorted, color=color, where='post', linewidth=2)
    ax.plot(sals_sorted if "salinity" in user_query.lower() else temps, depths_sorted, 'o', color=color, markersize=5)
    ax.set_xlabel(label, fontsize=12)
    ax.set_ylabel('Depth (m)', fontsize=12)
    ax.invert_yaxis()
    ax.set_title('Measurements vs. Depth (Step Chart)', fontsize=14)
    ax.grid(True, linestyle='--', alpha=0.7)
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    step_plot_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    
    return line_plot_base64, step_plot_base64

def generate_summary(user_query: str, df, sql_text: str, retrieved: list) -> str:
    system_msg = (
        "You are a friendly AI assistant specializing in ocean data analysis, designed to communicate like a helpful bot. "
        "Generate a clear, concise, and natural language response for the user's query. "
        "If data is available, describe key insights, trends (e.g., changes over time, averages, min/max), "
        "and patterns based on the data and retrieved context, using terms like 'increasing', 'decreasing', or 'stable' with supporting numbers. "
        "If no data is returned (empty or None), summarize the retrieved context in a conversational way, focusing on relevant details like salinity, temperature, or depth, as if you found related information. "
        "Do not speculate about missing data or suggest data issues unless explicitly indicated. "
        "For failed queries, briefly note the lack of results and provide a summary of the retrieved context. "
        "Keep the tone approachable, accurate, and context-appropriate."
    )
    
    if df is not None and isinstance(df, pd.DataFrame) and not df.empty:
        data_str = df.to_string(index=False)
        user_msg = f"User query: {user_query}\nData (as table):\n{data_str}\nSQL used: {sql_text}\nRetrieved context: {retrieved}"
    else:
        user_msg = f"User query: {user_query}\nNo data returned for the query.\nSQL used: {sql_text}\nRetrieved context: {retrieved}"
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.5,
        max_tokens=512,
    )
    return response.choices[0].message.content.strip()

def generate_generic_response(user_query: str) -> str:
    system_msg = (
        "You are a friendly AI assistant with expertise in oceanography. "
        "The user has asked a generic or informational question about ocean data. "
        "Provide a clear, concise, and natural language explanation tailored to the query. "
        "Focus on being informative, approachable, and accurate, using general knowledge about ocean data. "
        "Do not reference specific datasets, measurements, or technical details unless explicitly relevant. "
        "Keep the response under 300 words."
    )
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": f"User query: {user_query}"},
        ],
        temperature=0.5,
        max_tokens=512,
    )
    return response.choices[0].message.content.strip()

# -------------------------
# Main pipeline
# -------------------------
def query_pipeline(user_query: str, k: int = 20, debug: bool = False):
    if is_generic_query(user_query):
        summary = generate_generic_response(user_query)
        return None, None, None, [], summary, None, None
    
    context_text, retrieved = retrieve_context(user_query, k=k)
    if debug:
        print("=== Retrieved context ===")
        print(context_text)
        print("=========================")

    schema_text = (
        "Tables:\n"
        "- profiles(profile_id, latitude, longitude, time, cycle_number, platform_number)\n"
        "- measurements(profile_id, depth_m, temp, psal, sigma_theta)\n"
        "- calibration(profile_id, scientific_calib_equation, scientific_calib_coefficient, scientific_calib_comment)\n"
        "- platforms(platform_number, platform_type, project_name, pi_name)\n\n"
    )

    system_msg = (
        "You are a SQL expert. Using the schema below and the retrieved context, "
        "generate ONE valid SQL query in DuckDB syntax that answers the user's question. "
        "Output ONLY the SQL query (no explanation, no prose). If a cast of profiles.time is required, "
        "use CAST(profiles.time AS TIMESTAMP). Use measurements.psal for salinity. "
        "Note: There is no 'pres' or 'pressure' column; use 'depth_m' for depth/pressure-related data, "
        "as depth in meters approximates pressure (roughly 1 dbar per meter). "
        "Be careful with syntax: ensure CAST functions have proper parentheses, e.g., CAST(profiles.time AS TIMESTAMP). "
        "For trends over time, aggregate by day or appropriate interval, e.g., use DATE(CAST(profiles.time AS TIMESTAMP)) for daily grouping."
    )

    user_msg = f"{schema_text}Retrieved context:\n{context_text}\n\nUser question: {user_query}"

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.0,
        max_tokens=1024,
    )

    raw_llm_text = response.choices[0].message.content
    sql_text = sanitize_llm_output(raw_llm_text)
    sql_text = adjust_sql_for_time_cast(sql_text)

    try:
        result_df = con.execute(sql_text).df()
    except Exception as e:
        print("❌ SQL execution error:", e)
        result_df = None

    line_plot_base64, step_plot_base64 = generate_plots(result_df, retrieved, user_query)

    summary = generate_summary(user_query, result_df, sql_text, retrieved)

    if result_df is not None:
        return result_df, sql_text, raw_llm_text, retrieved, summary, line_plot_base64, step_plot_base64
    else:
        return None, sql_text, raw_llm_text, retrieved, summary, line_plot_base64, step_plot_base64
