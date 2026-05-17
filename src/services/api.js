import axios from "axios"
import { API_BASE } from "./config"

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      if (path !== "/" && path !== "/register") {
        localStorage.removeItem("token")
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export default api
