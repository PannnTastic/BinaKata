'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)
  
  useEffect(() => {
    const stored = localStorage.getItem('last_assessment_result')
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      router.push('/dashboard')
    }
  }, [])
  
  if (!result) return null
  
  const riskPercent = (result.risk_score * 100).toFixed(0)
  const riskLevel = result.risk_score >= 0.7 ? 'Tinggi' : 
                    result.risk_score >= 0.4 ? 'Sedang' : 'Rendah'
  const riskColor = result.risk_score >= 0.7 ? 'text-red-500 bg-red-50' :
                    result.risk_score >= 0.4 ? 'text-yellow-500 bg-yellow-50' : 
                    'text-green-500 bg-green-50'
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-2xl mx-auto">
        <div className="card space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Hasil Tes Kemampuan</h1>
            <p className="text-gray-600">Hasil tes deteksi dini telah selesai dianalisis</p>
          </div>
          
          <div className={`rounded-xl p-8 text-center ${riskColor}`}>
            <div className="text-6xl font-bold mb-2">{riskPercent}%</div>
            <div className="text-xl font-semibold mb-4">Tingkat Risiko: {riskLevel}</div>
            <div className="text-sm max-w-md mx-auto">{result.recommendation}</div>
          </div>
          
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Langkah Selanjutnya:</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                Berdasarkan hasil tes, kami merekomendasikan program pembelajaran yang disesuaikan dengan kebutuhan anak Anda.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/dashboard" className="btn flex-1">Kembali ke Dashboard</Link>
            <Link href="/screening" className="btn bg-white text-primary border border-primary hover:bg-blue-50 flex-1">
              Tes Ulang
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}