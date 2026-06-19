from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

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