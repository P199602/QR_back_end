import { Link, useLocation } from "react-router-dom"

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/members", label: "Add Member" },
  { to: "/create-group", label: "Create Group" },
  { to: "/groups", label: "Groups" },
  { to: "/profile", label: "Profile" },
]

export default function Sidebar({ onNavigate }) {
  const location = useLocation()

  const logout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <>
      <nav className="sidebar-nav">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? "active" : ""}
            onClick={onNavigate}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button type="button" className="logout-btn" onClick={logout}>
        Logout
      </button>
    </>
  )
}
