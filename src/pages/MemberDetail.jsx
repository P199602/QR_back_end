import Layout from "../components/Layout"
import api from "../services/api"
import { mediaUrl } from "../services/media"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MapLocationLink from "../components/MapLocationLink"
import { appendCoordsToFormData, tryGetCurrentCoords } from "../utils/geo"

const PLACEHOLDER_PHOTO =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

function toFormState(member) {
  return {
    group_id: String(member.group_id || ""),
    name: member.name || "",
    father_name: member.father_name || "",
    mobile: member.mobile || "",
    relation: member.relation || "",
    age: member.age != null ? String(member.age) : "",
    location: member.location || "",
    organization: member.organization || "",
    place_visit: member.place_visit || "",
    emergency_contact: member.emergency_contact || "",
  }
}

export default function MemberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [groups, setGroups] = useState([])
  const [form, setForm] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [memberRes, groupsRes] = await Promise.all([
        api.get(`member/${id}/`),
        api.get("groups/"),
      ])
      setData(memberRes.data)
      setForm(toFormState(memberRes.data))
      setGroups(groupsRes.data)
    } catch {
      setData(null)
      setError("Could not load member.")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError("")
    setMessage("")
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError("Name is required.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const coords = await tryGetCurrentCoords()
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") formData.append(key, value)
      })
      appendCoordsToFormData(formData, coords)
      if (photo) formData.append("photo", photo)

      const res = await api.put(`member/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setData(res.data.member)
      setForm(toFormState(res.data.member))
      setPhoto(null)
      setEditing(false)
      setMessage("Member updated successfully.")
    } catch {
      setError("Could not save changes.")
    } finally {
      setSaving(false)
    }
  }

  const regenerateQr = async () => {
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const res = await api.post(`member/${id}/regenerate-qr/`)
      setData(res.data.member)
      setForm(toFormState(res.data.member))
      setMessage("QR code regenerated.")
    } catch {
      setError("Could not regenerate QR.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete ${data.name}? This cannot be undone.`)) return

    setSaving(true)
    setError("")
    try {
      await api.delete(`member/${id}/`)
      navigate("/members", { replace: true })
    } catch {
      setError("Could not delete member.")
      setSaving(false)
    }
  }

  const printCard = () => window.print()

  if (loading) {
    return (
      <Layout>
        <p className="page-loading">Loading member card…</p>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <p className="form-error form-error--center">{error || "Member not found."}</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="member-detail-page">
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        <div className="member-detail-grid">
          <article className="id-card id-card--detail">
            <div className="id-header">📁 {data.group_name}</div>

            <img
              className="user-photo"
              src={mediaUrl(data.photo) || PLACEHOLDER_PHOTO}
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

            <div className="qr-box">
              <img
                className="qr-img"
                src={
                  mediaUrl(data.qr) ||
                  "https://via.placeholder.com/150?text=No+QR"
                }
                alt="Member QR code"
              />
            </div>

            <div className="card-actions no-print">
              <button type="button" className="print-btn" onClick={printCard}>
                Print Card
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={regenerateQr}
                disabled={saving}
              >
                Regenerate QR
              </button>
            </div>
          </article>

          <section className="form-card member-edit-panel no-print">
            <div className="panel-header">
              <h2 className="form-title">Edit member</h2>
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setEditing((v) => !v)
                  setForm(toFormState(data))
                  setPhoto(null)
                  setError("")
                }}
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            {editing && form ? (
              <form onSubmit={save} noValidate>
                <div className="form-grid form-grid--single">
                  <label className="form-field form-field--full">
                    <span className="form-label">Group</span>
                    <select
                      className="form-control"
                      value={form.group_id}
                      onChange={update("group_id")}
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-field form-field--full">
                    <span className="form-label">Full name *</span>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={update("name")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Father&apos;s name</span>
                    <input
                      className="form-control"
                      value={form.father_name}
                      onChange={update("father_name")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Mobile</span>
                    <input
                      className="form-control"
                      type="tel"
                      value={form.mobile}
                      onChange={update("mobile")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Relation</span>
                    <input
                      className="form-control"
                      value={form.relation}
                      onChange={update("relation")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Age</span>
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      value={form.age}
                      onChange={update("age")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Location</span>
                    <input
                      className="form-control"
                      value={form.location}
                      onChange={update("location")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Organization</span>
                    <input
                      className="form-control"
                      value={form.organization}
                      onChange={update("organization")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Place to visit</span>
                    <input
                      className="form-control"
                      value={form.place_visit}
                      onChange={update("place_visit")}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Emergency contact</span>
                    <input
                      className="form-control"
                      type="tel"
                      value={form.emergency_contact}
                      onChange={update("emergency_contact")}
                    />
                  </label>

                  <label className="form-field form-field--full">
                    <span className="form-label">Change photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-file"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    />
                    {photo && (
                      <p className="muted">New photo selected: {photo.name}</p>
                    )}
                  </label>
                </div>

                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </form>
            ) : (
              <p className="form-sub">
                Click Edit to update details or change the member photo.
              </p>
            )}

            <div className="danger-zone">
              <h3>Danger zone</h3>
              <p className="form-sub">Permanently remove this member and their QR.</p>
              <button
                type="button"
                className="danger-btn"
                onClick={remove}
                disabled={saving}
              >
                Delete member
              </button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
