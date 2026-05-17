import Layout from "../components/Layout"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function CreateGroup() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const save = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Please enter a group name.")
      return
    }

    setLoading(true)
    setError("")
    try {
      await api.post("group/", { name: trimmed })
      setName("")
      navigate("/groups")
    } catch {
      setError("Could not create group. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="page-center">
        <form className="form-card" onSubmit={save} noValidate>
          <h2 className="form-title">Create Group</h2>
          <p className="form-sub">Create a new family group for your members.</p>

          {error && <p className="form-error">{error}</p>}

          <label className="form-field">
            <span className="form-label">Group name</span>
            <input
              className="form-control"
              placeholder="e.g. Sharma Family"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating…" : "Create Group"}
          </button>
        </form>
      </div>
    </Layout>
  )
}
