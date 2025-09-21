'use client'
import React, { useEffect, useState } from 'react'
import { apiBase, authHeaders } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function ScreeningPage(){
  const router = useRouter()
  const [childId, setChildId] = useState<number|null>(null)
  const [assessmentId, setAssessmentId] = useState<number|null>(null)
  const [items, setItems] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<number,string>>({})
  const [step, setStep] = useState(0)

  useEffect(()=>{
    // ensure a child exists; create default if none
    async function ensureChild(){
      const res = await fetch(`${apiBase()}/children/`, {headers: authHeaders()})
      let children = await res.json()
      if(!children.length){
        const c = await fetch(`${apiBase()}/children/`, {method:'POST', headers:{...authHeaders(), 'Content-Type':'application/json'}, body: JSON.stringify({name:'Anak Saya', age:9})}).then(r=>r.json())
        setChildId(c.id)
        return c.id
      }
      setChildId(children[0].id)
      return children[0].id
    }
    async function start(){
      const cid = await ensureChild()
      const s = await fetch(`${apiBase()}/assessments/start`, {method:'POST', headers:{...authHeaders(), 'Content-Type':'application/json'}, body: JSON.stringify({child_id: cid})}).then(r=>r.json())
      setAssessmentId(s.assessment_id)
      // Construct UI items matching PDF: letters -> words -> arrange
      const seq:any[] = []
      const letters = ['A','B','D','P']
      letters.forEach((l,i)=> seq.push({type:'letter', prompt:l, placeholder:'Ketik huruf yang kamu lihat', clientId:i}))
      const words = ['Paku','Baku','Kuda','Buku']
      words.forEach((w,i)=> seq.push({type:'word', prompt:w, placeholder:'Ketik kata yang kamu lihat', clientId:100+i}))
      seq.push({type:'arrange', prompt:'K U C I N G', target:'KUCING', placeholder:'Susun huruf menjadi kata', clientId:999})
      setItems(seq)
    }
    start().catch(()=>{})
  },[])

  function current(){ return items[step] }

  function next(){ if(step < items.length-1) setStep(step+1) }
  function prev(){ if(step>0) setStep(step-1) }

  async function submit(){
    if(!assessmentId) return
    // Map answers to API items by position order (we stored clientId; backend tracks DB order in same count)
    const mapped = Object.entries(answers).map(([clientId, ans], idx)=> ({ id: idx+1, answer: ans }))
    const res = await fetch(`${apiBase()}/assessments/submit`, {method:'POST', headers:{...authHeaders(), 'Content-Type':'application/json'}, body: JSON.stringify({assessment_id: assessmentId, answers: mapped})})
    const data = await res.json()
    alert(`Skor Risiko: ${(data.risk_score*100).toFixed(0)}%\nRekomendasi: ${data.recommendation}`)
    router.push('/dashboard')
  }

  const it = current()
  return (
    <main className="max-w-xl mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">Tes Skrining Disleksia</h1>
      {it && (
        <div className="space-y-2">
          <div className="text-center text-5xl font-extrabold text-primary py-6">{it.prompt}</div>
          <input className="w-full border rounded px-3 py-2" placeholder={it.placeholder} value={answers[it.clientId]||''} onChange={e=>setAnswers({...answers, [it.clientId]: e.target.value})}/>
        </div>
      )}
      <div className="flex justify-between">
        <button onClick={prev} className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">Kembali</button>
        {step < items.length-1 ? (
          <button onClick={next} className="btn">Lanjut</button>
        ) : (
          <button onClick={submit} className="btn">Selesai</button>
        )}
      </div>
    </main>
  )
}