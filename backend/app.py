from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)

db = client["atlas"]

trips_collection = db["trips"]

wishlist_collection = db["wishlist"]

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

class WishlistItem(BaseModel):
    destination: str

@app.get("/")
def root():
    return {"message": "Welcome to Atlas"}


## Trip endpoints
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

@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: str):

    trips_collection.delete_one(
        {"_id": ObjectId(trip_id)} ## convert into syntax for Mongodb
    )

    return {"success": True}

@app.put("/trips/{trip_id}")
async def update_trip(trip_id: str, trip_data: dict):
    trips_collection.update_one(
        {"_id": ObjectId(trip_id)},
        {
            "$set": {
                "destination": trip_data["destination"]
            }
        }
    )

    return {"message": "Trip updated"}


 ## Wishlist endpoints
@app.post("/wishlist")
def create_wishlist_item(item: WishlistItem):

    item_dict = item.model_dump()

    result = wishlist_collection.insert_one(item_dict)

    return {
        "success": True,
        "id": str(result.inserted_id)
    }

@app.get("/wishlist")
def get_wishlist():

    items = []

    for item in wishlist_collection.find():
        item["_id"] = str(item["_id"])
        items.append(item)

    return items

@app.delete("/wishlist/{item_id}")
def delete_wishlist_item(item_id: str):

    wishlist_collection.delete_one(
        {"_id": ObjectId(item_id)}
    )

    return {"success": True}