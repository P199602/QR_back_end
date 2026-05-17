import { googleMapsUrl, formatCoords } from "../utils/geo"

export default function MapLocationLink({
  latitude,
  longitude,
  label = "Open registered location in Google Maps",
}) {
  const url = googleMapsUrl(latitude, longitude)
  const coordsText = formatCoords(latitude, longitude)

  if (!url) return null

  return (
    <div className="map-location-block">
      {coordsText && (
        <p className="coords-text">
          <b>Registered GPS:</b> {coordsText}
        </p>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="map-link-btn"
      >
        📍 {label}
      </a>
    </div>
  )
}
