from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pipeline import query_pipeline
import pandas as pd

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/query")
def run_query(payload: dict):
    user_query = payload.get("query", "")
    output = query_pipeline(user_query)

    if isinstance(output, dict) and "error" in output:
        return output

    df, sql_text, raw_llm, retrieved_ctx, summary = output

    # Check if df is a DataFrame
    if isinstance(df, pd.DataFrame):
        result = df.to_dict(orient="records")
        return {"result": result, "sql": sql_text, "raw_llm": raw_llm, "retrieved": retrieved_ctx, "summary": summary}
    else:
        # SQL failed or returned None, send error
        return {"summary": summary}
