import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function FlyToLocation({ selectedTrip, locations }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedTrip) return

    const location = locations.find(
      (loc) => loc.destination === selectedTrip.destination
    )

    if (!location) return

    map.flyTo(
      [location.lat, location.lon],
      6,
      {
        animate: true,
        duration: 2
      }
    )
  }, [selectedTrip, locations, map])

  return null
}

function TravelMap({ trips, selectedTrip }) {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchCoordinates = async () => {
      const mappedLocations = []

      for (const trip of trips) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              trip.destination
            )}&format=json&limit=1`
          )

          const data = await response.json()

          if (data.length > 0) {
            mappedLocations.push({
              destination: trip.destination,
              lat: Number(data[0].lat),
              lon: Number(data[0].lon),
            })
          }
        } catch (error) {
          console.error(
            "Failed to geocode:",
            trip.destination,
            error
          )
        }
      }

      setLocations(mappedLocations)
    }

    if (trips.length > 0) {
      fetchCoordinates()
    }
  }, [trips])

  return (
    <div className="map-section">
      <h2 className="section-title">
        🌎 Atlas Travel Map
      </h2>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        className="travel-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToLocation
            selectedTrip={selectedTrip}
            locations={locations}
        />

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lon]}
          >
            <Popup>
              📍 {location.destination}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default TravelMap