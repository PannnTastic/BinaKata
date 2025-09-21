export function apiBase(){
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
}

export function authHeaders(){
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}