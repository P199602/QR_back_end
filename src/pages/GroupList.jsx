import Layout from "../components/Layout"
import api from "../services/api"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function GroupList() {
  const [data, setData] = useState([])

  useEffect(() => {
    api
      .get("groups/")
      .then((res) => setData(res.data))
      .catch(() => {})
  }, [])

  return (
    <Layout>
      <h2 className="page-heading">My Groups</h2>

      {data.length === 0 ? (
        <p className="empty-text">
          No groups yet.{" "}
          <Link to="/create-group">Create your first group</Link>
        </p>
      ) : (
        <div className="member-grid">
          {data.map((g) => (
            <Link key={g.id} to={`/group/${g.id}`} className="card-link">
              <article className="member-card">
                <h4>📁 {g.name}</h4>
                <p>Members: {g.members ?? 0}</p>
                <p className="muted">Tap to open</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
