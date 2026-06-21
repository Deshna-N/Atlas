import "./App.css"
import { useState, useEffect } from "react"

function App() {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")
  const [trips, setTrips] = useState([])

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
  };

  const fetchTrips = async () => {
      const response = await fetch("http://127.0.0.1:8000/trips");
      const trips = await response.json();
      setTrips(trips);
    };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="app">
      <h1>Atlas</h1>

      <div className="trip-form"> 
      <input
      placeholder="Destination"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
    />

    <br /><br />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br /><br />

        <button onClick={createTrip}>
          Create Trip
        </button>

          <p>{message}</p>
          </div>

          <h2>My Trips</h2>

          <div className="trip-grid">

  {trips.map((trip) => (
    <div className="trip-card" key={trip._id}>
      <h3>{trip.destination}</h3>
      <p>
        {trip.start_date} - {trip.end_date}
      </p>
      <p>${trip.budget}</p>
      <p>{trip.notes}</p>
    </div>
  ))}
    </div>
    </div>
  );
}

export default App;