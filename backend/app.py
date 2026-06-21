from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)

db = client["atlas"]

trips_collection = db["trips"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Trip(BaseModel):
    destination: str = Field(..., min_length=1)
    start_date: str
    end_date: str
    budget: int = Field(..., gt=0)
    notes: str

@app.get("/")
def root():
    return {"message": "Welcome to Atlas"}

@app.post("/trips")
def create_trip(trip: Trip):

    trip_dict = trip.model_dump()

    result = trips_collection.insert_one(trip_dict)

    return {
        "success": True,
        "id": str(result.inserted_id)
    }

@app.get("/trips")
def get_trips():

    trips = []

    for trip in trips_collection.find():
        trip["_id"] = str(trip["_id"])
        trips.append(trip)

    return trips