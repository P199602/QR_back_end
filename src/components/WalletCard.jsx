import { useEffect, useState } from "react"
import api from "../services/api"

export default function WalletCard() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await api.get("wallet/")
      setBalance(res.data.balance ?? 0)
    } catch {
      setBalance(0)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const addMoney = async () => {
    setLoading(true)
    try {
      const res = await api.post("wallet/add/", { amount: 5 })
      setBalance(res.data.balance ?? 0)
    } catch {
      alert("Could not add money. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wallet">
      <p className="wallet-label">Wallet Balance</p>
      <h1>₹{Number(balance).toFixed(2)}</h1>
      <button type="button" onClick={addMoney} disabled={loading}>
        {loading ? "Adding…" : "+ ₹5 Add Money"}
      </button>
    </div>
  )
}
