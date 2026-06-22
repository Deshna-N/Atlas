function TripCard({
  trip,
  editingTripId,
  editDestination,
  setEditingTripId,
  setEditDestination,
  updateTrip,
  deleteTrip
}) {

  return (
    <div className="trip-card">

      <h3>📍{trip.destination}</h3>
        <p className="trip-label">
        Adventure Planned
        </p>

    <p>🗓 {trip.start_date} - {trip.end_date}</p>

    <p>💰 ${trip.budget}</p>

    <p>📖 {trip.notes}</p>

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