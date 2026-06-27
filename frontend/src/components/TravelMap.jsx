import { useEffect, useState, useRef } from "react"
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

function FlyToLocation({ selectedTrip, locations, markerRefs }) {
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
    setTimeout(() => {
    const marker =
        markerRefs.current[selectedTrip.destination]

    if (marker) {
        marker.openPopup()
    }
    }, 2000)
  }, [selectedTrip, locations, map])

  return null
}

const weatherDescriptions = {
  0: "☀️ Clear Sky",
  1: "🌤 Mostly Clear",
  2: "⛅ Partly Cloudy",
  3: "☁️ Overcast",

  45: "🌫 Fog",
  48: "🌫 Freezing Fog",

  51: "🌦 Light Drizzle",
  53: "🌦 Moderate Drizzle",
  55: "🌧 Heavy Drizzle",

  61: "🌧 Light Rain",
  63: "🌧 Rain",
  65: "🌧 Heavy Rain",

  71: "❄️ Light Snow",
  73: "❄️ Snow",
  75: "❄️ Heavy Snow",

  80: "🌦 Rain Showers",
  81: "🌦 Heavy Showers",

  95: "⛈ Thunderstorm"
}

function TravelMap({ trips, selectedTrip }) {
  const [locations, setLocations] = useState([])
  const markerRefs = useRef({})
  const [weatherData, setWeatherData] = useState({})
  const [attractions, setAttractions] = useState({})

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
            ...trip,
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

  useEffect(() => {
    const fetchWeather = async () => {
    const weatherResults = {}
    for (const location of locations) {
        try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`)
        const data = await response.json()
        weatherResults[location.destination] = {
            ...data.current,

            temperatureF: data.current.temperature_2m,

            temperatureC:
                ((data.current.temperature_2m - 32) * 5) / 9
            }
        }
        catch (error) {
            console.error(error)
            }
    }
    setWeatherData(weatherResults)
    }
    if (locations.length > 0) {
        fetchWeather()
}
}, [locations])

useEffect(() => {

    const fetchAttractions = async () => {

        const attractionResults = {}

        for (const location of locations) {

            try {

                const response = await fetch(
                    `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${location.lon},${location.lat},10000&limit=5&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
                )

                const data = await response.json()

                attractionResults[location.destination] =
                    data.features || []

            } catch (error) {

                console.error(error)

            }

        }

        setAttractions(attractionResults)

    }

    if (locations.length > 0) {
        fetchAttractions()
    }

}, [locations])

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
        markerRefs={markerRefs}
        />

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lon]}
            ref={(ref) => {
                markerRefs.current[location.destination] = ref
            }}
        >
            <Popup>

                <h3>📍 {location.destination}</h3>
                <p>
                    🗓 {location.start_date} - {location.end_date}
                </p>
                <p>
                    💰 Budget: ${location.budget}
                </p>
                <p>
                    📖 {location.notes}
                </p>
                <hr />
                <h4>
                🌤 Current Weather
                </h4>
                {weatherData[location.destination] ? (
                <>
                <p>
                {weatherDescriptions[weatherData[location.destination].weather_code]}
                </p>
                <p>
                🌡 {Math.round(weatherData[location.destination].temperatureF)}°F
                ({Math.round(weatherData[location.destination].temperatureC)}°C)
                </p>
                <p>
                💨 {Math.round(weatherData[location.destination].wind_speed_10m)} km/h
                </p>
                </>
                ) : (
                <p>
                Loading weather...
                </p>
                )}

                <hr />
                <h4>⭐ Top Attractions</h4>
                {attractions[location.destination] ? (
                attractions[location.destination].length > 0 ? (
                    <ul>
                    {attractions[location.destination].map((place, index) => (
                        <li key={index}>
                          <a
                            className="attraction-link"
                            href={`https://www.google.com/maps/search/?api=1&query=${place.properties.lat},${place.properties.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {place.properties.name}
                          </a>

                        </li>
                    ))}
                    </ul>
                ) : (
                    <p>No attractions found.</p>
                )
                ) : (
                <p>Loading attractions...</p>
                )}
                </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default TravelMap