import { useState } from "react";

function App() {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")

  const createTrip = async () => {
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
  );
}

export default App;