'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string|undefined>()
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    const res = await fetch('/api/auth/register', {
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({email, password})
    })
    if(!res.ok){ 
      const data = await res.json()
      setError(data.error || 'Gagal daftar')
      return 
    }
    const data = await res.json()
    localStorage.setItem('token', data.access_token)
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md w-full card space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">BinaKata</h1>
          <p className="text-gray-600 mt-2">Daftar Akun</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded-lg px-4 py-2.5" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kata Sandi</label>
            <input className="w-full border rounded-lg px-4 py-2.5" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn w-full py-3">Daftar Sekarang</button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun? <Link href="/auth/login" className="text-primary hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </main>
  )
}
