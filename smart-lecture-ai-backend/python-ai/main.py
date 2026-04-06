import sys
import os
import shutil
import asyncio
from pathlib import Path

# Add ai_models directory to Python path so we can import from it
AI_MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "backend", "src", "ai_models")
sys.path.insert(0, AI_MODELS_DIR)

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import AI modules at startup so models load once and stay warm
try:
    from transcriber import extract_audio, transcribe_audio
except Exception as _e:
    extract_audio = transcribe_audio = None
    print(f"[main] WARNING: transcriber import failed: {_e}", file=sys.stderr)

try:
    from extractor import extract_text_from_video
except Exception as _e:
    extract_text_from_video = None
    print(f"[main] WARNING: extractor import failed: {_e}", file=sys.stderr)

try:
    from quiz_generator import generate_quiz
except Exception as _e:
    generate_quiz = None
    print(f"[main] WARNING: quiz_generator import failed: {_e}", file=sys.stderr)

try:
    from cleaner import clean_text
except Exception as _e:
    clean_text = None
    print(f"[main] WARNING: cleaner import failed: {_e}", file=sys.stderr)

try:
    from summarize import summarize_text
except Exception as _e:
    summarize_text = None
    print(f"[main] WARNING: summarize import failed: {_e}", file=sys.stderr)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Lecture Lens - Python AI Services")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "python-ai"}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if transcribe_audio is None:
        raise HTTPException(status_code=500, detail="Transcriber module unavailable")

    target = UPLOAD_DIR / file.filename
    with open(target, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        ext = os.path.splitext(file.filename)[1].lower()
        video_exts = {".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv"}

        def _run():
            audio_path = str(target)
            if ext in video_exts:
                audio_path = extract_audio(str(target), output_audio=str(UPLOAD_DIR / "audio.wav"))
            return transcribe_audio(audio_path)

        # Run CPU-bound transcription in thread pool so event loop stays free
        results = await asyncio.to_thread(_run)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        if target.exists():
            target.unlink(missing_ok=True)


@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    if extract_text_from_video is None:
        raise HTTPException(status_code=500, detail="Extractor module unavailable")

    target = UPLOAD_DIR / file.filename
    with open(target, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        frames = await asyncio.to_thread(extract_text_from_video, str(target))
        return {"frames": frames}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Frame extraction failed: {e}")
    finally:
        if target.exists():
            target.unlink(missing_ok=True)


@app.post("/quiz")
async def quiz(payload: dict):
    if generate_quiz is None:
        raise HTTPException(status_code=500, detail="Quiz generator module unavailable")

    text = payload.get("text", "")
    num_questions = payload.get("num_questions", 5)
    if not text:
        raise HTTPException(status_code=400, detail="`text` is required")

    try:
        questions = await asyncio.to_thread(generate_quiz, text, num_questions)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {e}")


@app.post("/clean")
async def clean(payload: dict):
    if clean_text is None:
        raise HTTPException(status_code=500, detail="Cleaner module unavailable")

    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="`text` is required")

    try:
        result = await asyncio.to_thread(clean_text, text)
        return {"text": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {e}")


@app.post("/summarize")
async def summarize(payload: dict):
    if summarize_text is None:
        raise HTTPException(status_code=500, detail="Summarizer module unavailable")

    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="`text` is required")

    try:
        summary = await asyncio.to_thread(summarize_text, text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {e}")


if __name__ == "__main__":
    # Use multiple workers so concurrent requests don't block each other
    uvicorn.run("main:app", host="0.0.0.0", port=8000, workers=2)
