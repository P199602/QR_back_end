import Layout from "../components/Layout"
import api from "../services/api"
import { mediaUrl } from "../services/media"
import { useEffect, useState } from "react"
import MapLocationLink from "../components/MapLocationLink"
import { appendCoordsToFormData, tryGetCurrentCoords } from "../utils/geo"

const PLACEHOLDER =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [mobile, setMobile] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const load = async () => {
    try {
      const res = await api.get("profile/")
      setProfile(res.data)
      setMobile(res.data.mobile || "")
    } catch {
      setError("Could not load profile.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const coords = await tryGetCurrentCoords()
      const formData = new FormData()
      formData.append("mobile", mobile.trim())
      appendCoordsToFormData(formData, coords)
      if (file) formData.append("photo", file)

      const res = await api.put("profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setProfile(res.data)
      setFile(null)
      setMessage("Profile updated.")
    } catch {
      setError("Could not save profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="page-loading">Loading profile…</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-center">
        <form className="form-card" onSubmit={save} noValidate>
          <h2 className="form-title">Profile</h2>
          <p className="form-sub">Update your account photo and contact details.</p>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <div className="profile-photo-wrap">
            <img
              src={mediaUrl(profile?.photo) || PLACEHOLDER}
              alt="Profile"
              className="profile-photo"
            />
          </div>

          <label className="form-field">
            <span className="form-label">Username</span>
            <input
              className="form-control"
              value={profile?.username || ""}
              disabled
            />
          </label>

          <label className="form-field">
            <span className="form-label">Mobile</span>
            <input
              className="form-control"
              type="tel"
              placeholder="Your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </label>

          <MapLocationLink
            latitude={profile?.latitude}
            longitude={profile?.longitude}
            label="Open my registration location in Google Maps"
          />

          <label className="form-field">
            <span className="form-label">Profile photo</span>
            <input
              type="file"
              accept="image/*"
              className="form-file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </Layout>
  )
}
