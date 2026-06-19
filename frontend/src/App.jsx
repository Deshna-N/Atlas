import { useState } from "react";

function App() {
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");

  const createTrip = async () => {
    const response = await fetch("http://127.0.0.1:8000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: destination,
        start_date: "2026-12-15",
        end_date: "2026-12-25",
        budget: 2500,
        notes: "Test trip",
      }),
    });

    const data = await response.json();

    setMessage(`Trip created: ${data.trip.destination}`);
  };

  return (
    <div>
      <h1>Atlas</h1>

      <input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <button onClick={createTrip}>
        Create Trip
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;