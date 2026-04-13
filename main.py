import os
import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from analyzer import process_nc_files, generate_proxy_model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
os.makedirs(frontend_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

@app.get("/")
def serve_index():
    index_path = os.path.join(frontend_dir, "index.html")
    if not os.path.exists(index_path):
        return HTMLResponse(content="<h1>Frontend not found</h1><p>index.html is missing in the frontend directory</p>", status_code=404)
    with open(index_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.post("/analyze")
async def analyze_file(files: List[UploadFile] = File(...)):
    temp_paths = []
    try:
        for file in files:
            temp_path = f"temp_{file.filename}"
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            temp_paths.append(temp_path)
            
        result = process_nc_files(temp_paths)
        return result
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        for p in temp_paths:
            if os.path.exists(p):
                os.remove(p)

@app.post("/model")
async def get_model(t: float = Form(...), z: float = Form(...), logg: float = Form(...), wave_min: float = Form(...), wave_max: float = Form(...)):
    try:
        result = generate_proxy_model(t, z, logg, wave_min, wave_max)
        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
