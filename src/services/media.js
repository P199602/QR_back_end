import { MEDIA_BASE } from "./config"

export function mediaUrl(path) {
  if (!path) return null
  if (path.startsWith("http")) return path
  return `${MEDIA_BASE}${path}`
}
