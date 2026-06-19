from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Trip(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    notes: str

@app.get("/")
def root():
    return {"message": "Welcome to Atlas"}

@app.post("/trips")
def create_trip(trip: Trip):
    print(trip)

    return {
        "success": True,
        "trip": trip
    }