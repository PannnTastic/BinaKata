'use client'
import React, { useState } from 'react'
import { apiBase } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string|undefined>()
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    const res = await fetch(`${apiBase()}/auth/register`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password})})
    if(!res.ok){ setError('Gagal daftar'); return }
    const data = await res.json()
    localStorage.setItem('token', data.access_token)
    router.push('/dashboard')
  }

  return (
    <main className="max-w-md mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">Daftar Akun</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Kata Sandi" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn w-full">Daftar</button>
      </form>
    </main>
  )
}