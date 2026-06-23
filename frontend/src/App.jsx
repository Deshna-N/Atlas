import "./App.css"
import Dashboard from "./components/Dashboard"
import TripCard from "./components/TripCard"
import WishlistCard from "./components/WishlistCard"
import { useState, useEffect } from "react"

function App() {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [trips, setTrips] = useState([])
  const [editingTripId, setEditingTripId] = useState(null)
  const [editDestination, setEditDestination] = useState("")
  const [wishlist, setWishlist] = useState([])
  const [dreamDestination, setDreamDestination] = useState("")
  const [fireflies] = useState(
  Array.from({ length: 25 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    size: 2 + Math.random() * 6,
    duration: 6 + Math.random() * 10
  }))
)
const [clouds] = useState(
  Array.from({ length: 18 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    size: 2 + Math.random() * 3
  }))
)
const [theme, setTheme] = useState("dark")

  const createTrip = async () => {
    if (
      !destination ||
      !startDate ||
      !endDate ||
      !budget
    ) {
      setMessage("Please fill out all required fields.");
      return;
    }
    const response = await fetch("http://127.0.0.1:8000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: destination,
        start_date: startDate,
        end_date: endDate,
        budget: Number(budget),
        notes: notes,
        image_url: imageUrl,
    }),
    });

    if (!response.ok) {
      const error = await response.json()
      setMessage("Trip creation failed.")
      return
    }
    const data = await response.json();
    await fetchTrips();
    setMessage(`Trip created: ${destination}`);
    setImageUrl("")
    setDestination("")
    setStartDate("")
    setEndDate("")
    setBudget("")
    setNotes("")
  };

  const fetchTrips = async () => {
      const response = await fetch("http://127.0.0.1:8000/trips");
      const trips = await response.json();
      setTrips(trips);
    };

  const fetchWishlist = async () => {
  const response = await fetch("http://127.0.0.1:8000/wishlist")
  const items = await response.json()
  setWishlist(items)
  }

  useEffect(() => {
    fetchTrips();
    fetchWishlist()
  }, []);
  useEffect(() => {
  document.body.className = theme
}, [theme])

const deleteTrip = async (tripId) => {
  await fetch(
    `http://127.0.0.1:8000/trips/${tripId}`,
      {
        method: "DELETE",
      }
    );

    await fetchTrips();
};

const updateTrip = async (tripId) => {
  const response = await fetch(
    `http://127.0.0.1:8000/trips/${tripId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: editDestination,
      }),
    }
  )
  if (!response.ok) {
    setMessage("Failed to update trip")
    return
  }
  await fetchTrips()
  setEditingTripId(null)
  setMessage("Trip updated!")
}

const addWishlistItem = async () => {

  if (!dreamDestination.trim()) {
    return}
  await fetch("http://127.0.0.1:8000/wishlist", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      destination: dreamDestination
    })
  })
  setDreamDestination("")
  fetchWishlist()
}

const deleteWishlistItem = async (itemId) => {
  await fetch(
    `http://127.0.0.1:8000/wishlist/${itemId}`,
    {
      method: "DELETE"
    }
  )
  fetchWishlist()
}


  return (
    <div className={`app ${theme}`}>
      {theme === "dark" ? (

    fireflies.map((firefly, index) => (
      <div
        key={index}
        className="firefly"
        style={{
          top: `${firefly.top}%`,
          left: `${firefly.left}%`,
          animationDelay: `${firefly.delay}s`,
          width: `${firefly.size}px`,
          height: `${firefly.size}px`
        }}
      />
    ))

  ) : (

    clouds.map((cloud, index) => (
      <div
        key={index}
        className="cloud"
        style={{
          top: `${cloud.top}%`,
          left: `${cloud.left}%`,
          animationDelay: `${cloud.delay}s`,
          fontSize: `${cloud.size}rem`
        }}
      >
        ☁️
      </div>
    ))

  )}

      <div className="hero">
        <h1>
          Atlas <span className="hero-star">✨</span>
        </h1>

        <p className="tagline">
          Remember the places you've been, and dream about the ones you'll discover.
        </p>

        <div className="theme-toggle">

          <button
          className={theme === "light" ? "active-theme" : ""}
          onClick={() => setTheme("light")}
        >
          ☀︎
        </button>

        <button
          className={theme === "dark" ? "active-theme" : ""}
          onClick={() => setTheme("dark")}
        >
          ☾
        </button>

        </div>
      </div>
      <div className="trip-form"> 
        <h2>Plan Your Adventure</h2>
        <input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        

        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button onClick={createTrip}>
          Create Trip
        </button>

        <p className="success-message">
          {message}
        </p>
        </div>

        <Dashboard trips={trips} />

      <h2 className="section-title">
        📖 My Journey Log
      </h2>
      <div className="trip-grid"> 


          {trips.map((trip) => (

        <TripCard
          key={trip._id}
          trip={trip}
          editingTripId={editingTripId}
          editDestination={editDestination}
          setEditingTripId={setEditingTripId}
          setEditDestination={setEditDestination}
          updateTrip={updateTrip}
          deleteTrip={deleteTrip}
        />

      ))}
    </div>

  <div className="wishlist-section">

  <h2>⭐ Future Adventures</h2>

  <div className="wishlist-input-row">

    <input
      placeholder="Add dream destination..."
      value={dreamDestination}
      onChange={(e) =>
        setDreamDestination(e.target.value)
      }
    />

    <button onClick={addWishlistItem}>
      Add Destination
    </button>

  </div>

  {wishlist.map((item) => (

  <WishlistCard
    key={item._id}
    item={item}
    deleteWishlistItem={deleteWishlistItem}
  />

))}

</div>

</div>
);
}

export default App;