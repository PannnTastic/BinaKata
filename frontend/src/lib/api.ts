export function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  const h: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  return h
}
