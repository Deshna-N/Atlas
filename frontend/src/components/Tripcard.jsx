function TripCard({
  trip,
  editingTripId,
  editDestination,
  setEditingTripId,
  setEditDestination,
  updateTrip,
  deleteTrip,
  setSelectedTrip
}) {

const today = new Date()

const tripStart = new Date(trip.start_date)

const diffTime =
  tripStart - today

const daysUntil =
  Math.ceil(
    diffTime /
    (1000 * 60 * 60 * 24)
  )

let countdownText = ""

if (daysUntil > 1) {
  countdownText =
    `${daysUntil} days away`
}
else if (daysUntil === 1) {
  countdownText =
    "Starts tomorrow"
}
else if (daysUntil === 0) {
  countdownText =
    "Starts today"
}
else {
  countdownText =
    "Adventure in progress"
}

  return (
    <div className="trip-card">
        {trip.image_url && (
        <img
            src={trip.image_url}
            alt={trip.destination}
            className="trip-image"
        />
        )}
        <h3>📍{trip.destination}</h3>
        <p className="countdown">
            ⏳ {countdownText}
            </p>
            <p className="trip-label">
            {countdownText === "Adventure in progress"
                ? "CURRENT ADVENTURE"
                : countdownText === "Adventure completed"
                ? "PAST ADVENTURE"
                : "ADVENTURE PLANNED"}
            </p>

     

        <p>💰 ${trip.budget}</p>

        <p>📖 {trip.notes}</p>
      <button
        onClick={() => setSelectedTrip(trip)}
      >
        View on Map
      </button>
      
      <button
        onClick={() => {
          setEditingTripId(trip._id)
          setEditDestination(trip.destination)
          
        }}
      >
        Edit Trip
      </button>

      <button
        onClick={() => deleteTrip(trip._id)}
      >
        Delete Trip
      </button>

      {editingTripId === trip._id && (

        <div>

          <input
            value={editDestination}
            onChange={(e) =>
              setEditDestination(e.target.value)
            }
          />

          <button
            onClick={() =>
              updateTrip(trip._id)
            }
          >
            Save Changes
          </button>

        </div>

      )}

    </div>
  )
}

export default TripCard