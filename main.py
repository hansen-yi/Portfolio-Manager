from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import os
import shutil
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

portfolio_db = {}  # Simulated in-memory DB

class MediaItem(BaseModel):
    id: str
    filename: str
    media_type: str  # "image" or "video"
    title: str
    description: str
    category: str

class Portfolio(BaseModel):
    user_id: str
    items: List[MediaItem]

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # FILL THIS IN
    # pass
    filePath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filePath, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "success", "url": filePath}

from fastapi.responses import FileResponse

@app.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if os.path.exists(file_path):
        return FileResponse(file_path)
    return JSONResponse(status_code=404, content={"error": "File not found"})

@app.post("/save-portfolio")
async def save_portfolio(data: Portfolio):
    portfolio_db[data.user_id] = data.items
    return {"status": "success"}

@app.get("/load-portfolio/{user_id}")
async def load_portfolio(user_id: str):
    return {"items": portfolio_db.get(user_id, [])}
