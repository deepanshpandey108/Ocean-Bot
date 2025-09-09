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
        return {"summary": output.get("summary", "An error occurred while processing the query.")}

    df, sql_text, raw_llm, retrieved_ctx, summary = output

    # Return only the summary
    return {"summary": summary}
