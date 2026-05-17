/** Get device GPS coordinates (asks browser permission). */
export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  })
}

/** Returns coords or null if denied / unavailable. */
export async function tryGetCurrentCoords() {
  try {
    return await getCurrentCoords()
  } catch {
    return null
  }
}

export function googleMapsUrl(latitude, longitude) {
  if (latitude == null || longitude == null || latitude === "" || longitude === "") {
    return null
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export function formatCoords(latitude, longitude) {
  if (latitude == null || longitude == null) return null
  return `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`
}

export function appendCoordsToFormData(formData, coords) {
  if (!coords) return
  formData.append("latitude", String(coords.latitude))
  formData.append("longitude", String(coords.longitude))
}
