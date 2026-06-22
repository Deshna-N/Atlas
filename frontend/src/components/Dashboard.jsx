function Dashboard({ trips }) {

  const totalBudget = trips.reduce(
    (total, trip) => total + trip.budget,
    0
  )

  return (
    <div className="dashboard">

      <div className="stat-card">
        <h3>{trips.length}</h3>
        <p>Trips Planned</p>
      </div>

      <div className="stat-card">
        <h3>${totalBudget}</h3>
        <p>Total Budget</p>
      </div>

    </div>
  )
}

export default Dashboard