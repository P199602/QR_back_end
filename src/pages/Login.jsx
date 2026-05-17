import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../services/api"

const initial = { username: "", password: "" }

export default function Login() {
  const navigate = useNavigate()
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const update = (field) => (e) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }))
    setError("")
  }

  const login = async (e) => {
    e.preventDefault()
    if (!data.username.trim() || !data.password) {
      setError("Please enter username and password.")
      return
    }

    setLoading(true)
    try {
      const res = await api.post("login/", data)
      localStorage.setItem("token", res.data.access)
      navigate("/dashboard")
    } catch {
      setError("Invalid username or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left" aria-hidden="true" />

      <div className="auth-right">
        <form className="form-box" onSubmit={login} noValidate>
          <h1>Sign In</h1>
          <p className="auth-subtitle">Welcome back to QR Family</p>

          {error && <p className="form-error form-error--center">{error}</p>}

          <label className="auth-field">
            <span>Username</span>
            <input
              className="input-box"
              placeholder="Enter username"
              value={data.username}
              onChange={update("username")}
              autoComplete="username"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              className="input-box"
              placeholder="Enter password"
              value={data.password}
              onChange={update("password")}
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>

          <p className="bottom-link">
            No account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
