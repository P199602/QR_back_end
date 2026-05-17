import Layout from "../components/Layout"
import api from "../services/api"
import { mediaUrl } from "../services/media"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { appendCoordsToFormData, tryGetCurrentCoords } from "../utils/geo"

const emptyMember = {
  group_id: "",
  name: "",
  father_name: "",
  mobile: "",
  relation: "",
  age: "",
  location: "",
  organization: "",
  place_visit: "",
  emergency_contact: "",
}

export default function MemberList() {
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [data, setData] = useState(emptyMember)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const load = async () => {
    const [m, g] = await Promise.all([
      api.get("members/"),
      api.get("groups/"),
    ])
    setMembers(m.data)
    setGroups(g.data)
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  const update = (field) => (e) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }))
    setError("")
    setSuccess("")
  }

  const add = async (e) => {
    e.preventDefault()

    if (!data.group_id || !data.name.trim()) {
      setError("Please select a group and enter the member name.")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const coords = await tryGetCurrentCoords()
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value != null) formData.append(key, value)
      })
      appendCoordsToFormData(formData, coords)
      if (photo) formData.append("photo", photo)

      await api.post("add_member/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setData(emptyMember)
      setPhoto(null)
      setSuccess("Member added successfully.")
      await load()
    } catch {
      setError("Could not add member. Check the form and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="page-wrap">
        <form className="form-card form-card--wide" onSubmit={add} noValidate>
          <h2 className="form-title">Add Member</h2>
          <p className="form-sub">
            Select a group and enter member details. Your current GPS is saved
            automatically when you allow location access.
          </p>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <div className="form-grid">
            <label className="form-field form-field--full">
              <span className="form-label">Group</span>
              <select
                className="form-control"
                value={data.group_id}
                onChange={update("group_id")}
              >
                <option value="">Select group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">Full name *</span>
              <input
                className="form-control"
                placeholder="Member name"
                value={data.name}
                onChange={update("name")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Father&apos;s name</span>
              <input
                className="form-control"
                value={data.father_name}
                onChange={update("father_name")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Mobile</span>
              <input
                className="form-control"
                type="tel"
                value={data.mobile}
                onChange={update("mobile")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Relation</span>
              <input
                className="form-control"
                value={data.relation}
                onChange={update("relation")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Age</span>
              <input
                className="form-control"
                type="number"
                min="0"
                value={data.age}
                onChange={update("age")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Location</span>
              <input
                className="form-control"
                value={data.location}
                onChange={update("location")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Organization</span>
              <input
                className="form-control"
                value={data.organization}
                onChange={update("organization")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Place to visit</span>
              <input
                className="form-control"
                value={data.place_visit}
                onChange={update("place_visit")}
              />
            </label>

            <label className="form-field">
              <span className="form-label">Emergency contact</span>
              <input
                className="form-control"
                type="tel"
                value={data.emergency_contact}
                onChange={update("emergency_contact")}
              />
            </label>

            <label className="form-field form-field--full">
              <span className="form-label">Photo</span>
              <input
                type="file"
                accept="image/*"
                className="form-file"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving…" : "Add Member"}
          </button>
        </form>

        <section className="list-section">
          <h3 className="section-title">All members</h3>

          {members.length === 0 ? (
            <p className="empty-text">No members yet. Add your first member above.</p>
          ) : (
            <div className="member-grid">
              {members.map((m) => (
                <Link key={m.id} to={`/member/${m.id}`} className="card-link">
                  <article className="member-card">
                    {m.photo && (
                      <img
                        src={mediaUrl(m.photo)}
                        alt={m.name}
                        className="member-thumb"
                      />
                    )}
                    <h4>{m.name}</h4>
                    <p>{m.relation || "—"}</p>
                    <p className="muted">{m.group_name}</p>
                    {m.qr && (
                      <div className="qr-box qr-box--small">
                        <img
                          src={mediaUrl(m.qr)}
                          className="qr-img qr-img--small"
                          alt={`QR for ${m.name}`}
                        />
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
