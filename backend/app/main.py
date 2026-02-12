from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def test():
    return {"status": "ok"}