import Layout from "../components/Layout"
import WalletCard from "../components/WalletCard"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"

export default function Dashboard() {
  const [groups, setGroups] = useState([])

  useEffect(() => {
    api
      .get("groups/")
      .then((res) => setGroups(res.data))
      .catch(() => {})
  }, [])

  return (
    <Layout>
      <WalletCard />

      <h2 className="page-heading">Dashboard</h2>

      <div className="grid">
        <Link to="/members" className="card-link">
          <article className="dash-card">
            <div className="card-icon">👨‍👩‍👧‍👦</div>
            <h4>Member List</h4>
            <p>Add & manage members</p>
          </article>
        </Link>

        <Link to="/create-group" className="card-link">
          <article className="dash-card">
            <div className="card-icon">➕</div>
            <h4>Create Group</h4>
            <p>Create new family group</p>
          </article>
        </Link>

        <Link to="/groups" className="card-link">
          <article className="dash-card">
            <div className="card-icon">📁</div>
            <h4>Groups</h4>
            <p>View all groups</p>
          </article>
        </Link>

        <Link to="/profile" className="card-link">
          <article className="dash-card">
            <div className="card-icon">👤</div>
            <h4>Profile</h4>
            <p>Account details</p>
          </article>
        </Link>
      </div>

      <h3 className="page-heading">Recent Groups</h3>

      {groups.length === 0 ? (
        <p className="empty-text">No groups yet.</p>
      ) : (
        <div className="member-grid">
          {groups.map((g) => (
            <Link key={g.id} to={`/group/${g.id}`} className="card-link">
              <article className="member-card">
                <h4>📁 {g.name}</h4>
                <p>Members: {g.members ?? 0}</p>
                <p className="muted">Click to open</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
