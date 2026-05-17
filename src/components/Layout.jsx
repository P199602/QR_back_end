import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="layout">
      <Header setOpen={setOpen} />

      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "show" : ""}`}>
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      <main className="content">{children}</main>
    </div>
  )
}
