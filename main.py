from fastapi import FastAPI
import uvicorn


app = FastAPI(title="Simple FastAPI Server", version="1.0.0")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI server!"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)