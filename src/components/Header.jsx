import { FaBars } from "react-icons/fa"

export default function Header({ setOpen }) {
  return (
    <header className="header">
      <button
        type="button"
        className="menu-btn"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <FaBars />
      </button>

      <div className="logo">QR Family</div>

      <div className="header-spacer" />
    </header>
  )
}
