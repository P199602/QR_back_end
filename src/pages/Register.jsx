import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../services/api"
import { tryGetCurrentCoords } from "../utils/geo"

const initial = {
  username: "",
  email: "",
  password: "",
  confirm: "",
}

export default function Register() {
  const navigate = useNavigate()
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const update = (field) => (e) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }))
    setError("")
  }

  const register = async (e) => {
    e.preventDefault()

    if (!data.username.trim() || !data.email.trim() || !data.password) {
      setError("Please fill in all fields.")
      return
    }

    if (data.password !== data.confirm) {
      setError("Passwords do not match.")
      return
    }

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    try {
      const coords = await tryGetCurrentCoords()
      const payload = {
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      }
      if (coords) {
        payload.latitude = coords.latitude
        payload.longitude = coords.longitude
      }

      await api.post("register/", payload)
      navigate("/")
    } catch (err) {
      const msg = err.response?.data
      if (typeof msg === "object") {
        const first = Object.values(msg).flat()[0]
        setError(typeof first === "string" ? first : "Registration failed.")
      } else {
        setError("Registration failed. Try a different username.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left" aria-hidden="true" />

      <div className="auth-right">
        <form className="form-box" onSubmit={register} noValidate>
          <h1>Sign Up</h1>
          <p className="auth-subtitle">
            Create your QR Family account. Allow location access to save your
            registration GPS on the map.
          </p>

          {error && <p className="form-error form-error--center">{error}</p>}

          <label className="auth-field">
            <span>Username</span>
            <input
              className="input-box"
              placeholder="Choose a username"
              value={data.username}
              onChange={update("username")}
              autoComplete="username"
            />
          </label>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              className="input-box"
              placeholder="you@example.com"
              value={data.email}
              onChange={update("email")}
              autoComplete="email"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              className="input-box"
              placeholder="At least 6 characters"
              value={data.password}
              onChange={update("password")}
              autoComplete="new-password"
            />
          </label>

          <label className="auth-field">
            <span>Confirm password</span>
            <input
              type="password"
              className="input-box"
              placeholder="Repeat password"
              value={data.confirm}
              onChange={update("confirm")}
              autoComplete="new-password"
            />
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          <p className="bottom-link">
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
