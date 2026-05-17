import Layout from "../components/Layout"
import api from "../services/api"
import { mediaUrl } from "../services/media"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export default function GroupMembers() {
  const { id } = useParams()
  const [members, setMembers] = useState([])
  const [group, setGroup] = useState({})

  useEffect(() => {
    api
      .get(`group/${id}/members/`)
      .then((res) => {
        setMembers(res.data.members)
        setGroup(res.data.group)
      })
      .catch(() => {})
  }, [id])

  return (
    <Layout>
      <h2 className="page-heading">📁 {group.name || "Group"}</h2>
      <p className="form-sub">Total members: {members.length}</p>

      {members.length === 0 ? (
        <p className="empty-text">No members in this group yet.</p>
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
                <h4>👤 {m.name}</h4>
                <p>{m.relation || "—"}</p>
                <p>Age: {m.age ?? "—"}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
