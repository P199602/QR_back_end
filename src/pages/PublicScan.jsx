import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../services/config"
import { mediaUrl } from "../services/media"
import MapLocationLink from "../components/MapLocationLink"

const PLACEHOLDER =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

export default function PublicScan() {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    axios
      .get(`${API_BASE}member/scan/${token}/`)
      .then((res) => setData(res.data))
      .catch(() => setError("Member not found or QR is invalid."))
  }, [token])

  if (error) {
    return (
      <div className="scan-page">
        <p className="form-error form-error--center">{error}</p>
        <p className="bottom-link">
          <Link to="/">Go to login</Link>
        </p>
      </div>
    )
  }

  if (!data) {
    return <p className="page-loading">Loading member…</p>
  }

  return (
    <div className="scan-page">
      <article className="id-card">
        <p className="scan-badge">Scanned member card</p>
        <div className="id-header">📁 {data.group_name}</div>

        <img
          className="user-photo"
          src={mediaUrl(data.photo) || PLACEHOLDER}
          alt={data.name}
        />

        <h2 className="id-name">{data.name}</h2>

        <div className="info">
          <p>
            <b>Father:</b> {data.father_name || "—"}
          </p>
          <p>
            <b>Mobile:</b> {data.mobile || "—"}
          </p>
          <p>
            <b>Relation:</b> {data.relation || "—"}
          </p>
          <p>
            <b>Location:</b> {data.location || "—"}
          </p>
          <p>
            <b>Organization:</b> {data.organization || "—"}
          </p>
          <p>
            <b>Place visit:</b> {data.place_visit || "—"}
          </p>
          <p>
            <b>Emergency:</b> {data.emergency_contact || "—"}
          </p>
        </div>

        <MapLocationLink
          latitude={data.latitude}
          longitude={data.longitude}
          label="Open registration location in Google Maps"
        />

        {data.qr && (
          <div className="qr-box">
            <img className="qr-img" src={mediaUrl(data.qr)} alt="QR code" />
          </div>
        )}
      </article>
    </div>
  )
}
