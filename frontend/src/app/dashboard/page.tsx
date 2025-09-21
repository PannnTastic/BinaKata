'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiBase, authHeaders } from '@/lib/api'
import CalendarHeatmap from '@/components/CalendarHeatmap'

export default function DashboardPage(){
  const [summary, setSummary] = useState<{total_assessments:number, average_risk:number|null}>({total_assessments:0, average_risk:null})

  useEffect(()=>{
    fetch(`${apiBase()}/dashboard/summary`, { headers: authHeaders() })
      .then(r=>r.json()).then(setSummary).catch(()=>{})
  },[])

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard Terapi</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-sm text-gray-500">Total Tes</div><div className="text-3xl font-bold">{summary.total_assessments}</div></div>
        <div className="card"><div className="text-sm text-gray-500">Rata-rata Risiko</div><div className="text-3xl font-bold">{summary.average_risk === null ? '-' : (summary.average_risk*100).toFixed(0)+ '%'}</div></div>
        <div className="card"><div className="text-sm text-gray-500">Quick Start</div><Link href="/screening" className="btn mt-2 inline-block">Mulai Tes</Link></div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Pencapaian dan Konsistensi</h2><span className="text-sm text-primary">Quick Result</span></div>
        <CalendarHeatmap/>
      </div>
    </main>
  )
}