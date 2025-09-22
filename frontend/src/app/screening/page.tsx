'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { authHeaders } from '@/lib/api'
import { useRouter } from 'next/navigation'

function similarity(a: string, b: string): number {
  // Simple normalized Levenshtein-like similarity
  a = a.toLowerCase().trim(); b = b.toLowerCase().trim();
  if (!a && !b) return 1
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({length: m+1}, ()=>Array(n+1).fill(0))
  for (let i=0;i<=m;i++) dp[i][0] = i
  for (let j=0;j<=n;j++) dp[0][j] = j
  for (let i=1;i<=m;i++){
    for (let j=1;j<=n;j++){
      const cost = a[i-1] === b[j-1] ? 0 : 1
      dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)
    }
  }
  const dist = dp[m][n]
  const maxLen = Math.max(m,n)
  return maxLen ? 1 - dist/maxLen : 1
}

export default function ScreeningPage(){
  const router = useRouter()
  const [childId, setChildId] = useState<string|null>(null)
  const [assessmentId, setAssessmentId] = useState<string|null>(null)
  const [items, setItems] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<number,string>>({})
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Extra metrics
  const [speechAcc, setSpeechAcc] = useState(0.5)
  const [imageAcc, setImageAcc] = useState(0.5)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const lastShownRef = useRef<number | null>(null)

  useEffect(()=>{
    lastShownRef.current = Date.now()
  },[step])

  useEffect(()=>{
    async function ensureChild(){
      const res = await fetch('/api/children', {headers: authHeaders()})
      let children = await res.json()
      if(!children.length){
        const c = await fetch('/api/children', {
          method:'POST', 
          headers:{...authHeaders(), 'Content-Type':'application/json'}, 
          body: JSON.stringify({name:'Anak Saya', age:9})
        }).then(r=>r.json())
        setChildId(c.id)
        return c.id
      }
      setChildId(children[0].id)
      return children[0].id
    }
    async function start(){
      const cid = await ensureChild()
      const s = await fetch('/api/assessments/start', {
        method:'POST',
        headers:{...authHeaders(), 'Content-Type':'application/json'}, 
        body: JSON.stringify({child_id: cid})
      }).then(r=>r.json())
      setAssessmentId(s.assessment_id)
      
      const seq:any[] = []
      const letters = ['A','B','D','P']
      letters.forEach((l,i)=> seq.push({type:'letter', prompt:l, placeholder:'Ketik huruf yang kamu lihat', clientId:i}))
      const words = ['Paku','Baku','Kuda','Buku']
      words.forEach((w,i)=> seq.push({type:'word', prompt:w, placeholder:'Ketik kata yang kamu lihat', clientId:100+i}))
      // Voice spelling
      seq.push({type:'voice', prompt:'Bola', placeholder:'Ucapkan kata: Bola', clientId:777})
      // Image recognition (pick correct name)
      seq.push({type:'image', prompt:'Pilih gambar: Kucing', options:[
        {label:'Kucing', src:'/images/cat.svg', correct:true},
        {label:'Buku', src:'/images/book.svg'},
        {label:'Bola', src:'/images/ball.svg'}
      ], clientId:888})
      // Arrange letters
      seq.push({type:'arrange', prompt:'K U C I N G', target:'KUCING', placeholder:'Susun huruf menjadi kata', clientId:999})
      setItems(seq)
    }
    start().catch(()=>{})
  },[])

  function current(){ return items[step] }
  function next(){ if(step < items.length-1) setStep(step+1) }
  function prev(){ if(step>0) setStep(step-1) }

  function recordReaction(){
    const now = Date.now()
    if (lastShownRef.current){
      const delta = (now - lastShownRef.current)/1000
      setReactionTimes(prev=>[...prev, delta])
    }
  }

  async function submit(){
    if(!assessmentId) return
    setLoading(true)

    // Save extra metrics to a global var accessible by API route
    const avgReactionTime = reactionTimes.length ? (reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length) : 2.0
    ;(globalThis as any)._binakata_extra_metrics = JSON.stringify({ speechAcc, imageAcc, avgReactionTime })
    
    const mapped = items.map((item, idx) => ({
      id: idx + 1,
      answer: answers[item.clientId] || ''
    }))
    
    const res = await fetch('/api/assessments/submit', {
      method:'POST',
      headers:{...authHeaders(), 'Content-Type':'application/json'},
      body: JSON.stringify({assessment_id: assessmentId, answers: mapped})
    })
    const data = await res.json()
    
    localStorage.setItem('last_assessment_result', JSON.stringify(data))
    router.push('/results')
  }

  const it = current()
  const progress = items.length > 0 ? ((step + 1) / items.length) * 100 : 0

  const [listening, setListening] = useState(false)
  function handleVoice(){
    recordReaction()
    const anyWin = window as any
    const SR = anyWin.SpeechRecognition || anyWin.webkitSpeechRecognition
    if (!SR){
      alert('Browser tidak mendukung pengenalan suara. Silakan gunakan Chrome.');
      return
    }
    const rec = new SR()
    rec.lang = 'id-ID'
    rec.interimResults = false
    setListening(true)
    rec.onresult = (e: any)=>{
      setListening(false)
      const text = e.results[0][0].transcript || ''
      const target = it?.prompt || ''
      const score = similarity(text, target) // 0..1
      setSpeechAcc(prev=> (prev*0.5 + score*0.5))
      setAnswers(a=> ({...a, [it.clientId]: text}))
    }
    rec.onerror = ()=> setListening(false)
    rec.onend = ()=> setListening(false)
    rec.start()
  }

  function handleImageSelect(opt: any){
    recordReaction()
    const correct = !!opt.correct
    setImageAcc(prev => {
      const v = Math.max(0, Math.min(1, prev + (correct ? 0.25 : -0.1)))
      return v
    })
    setAnswers(a=> ({...a, [it.clientId]: opt.label}))
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-2xl mx-auto">
        <div className="card space-y-6 p-8">
          <div>
            <h1 className="text-2xl font-bold">Tes Skrining Disleksia</h1>
            <p className="text-gray-600 mt-1">Langkah {step + 1} dari {items.length}</p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>
          </div>
          
          {it && (
            <div className="space-y-6">
              {it.type === 'voice' ? (
                <div className="space-y-4 text-center">
                  <div className="text-xl">Ucapkan kata berikut:</div>
                  <div className="text-5xl font-bold text-primary">{it.prompt}</div>
                  <button onClick={handleVoice} className="btn" disabled={loading || listening}>
                    {listening ? 'Mendengarkan...' : 'Mulai Rekam'}
                  </button>
                  <div className="text-sm text-gray-600">Skor suara sementara: {(speechAcc*100).toFixed(0)}%</div>
                </div>
              ) : it.type === 'image' ? (
                <div className="space-y-4">
                  <div className="text-center text-xl font-semibold">{it.prompt}</div>
                  <div className="grid grid-cols-3 gap-4">
                    {it.options.map((opt:any, idx:number)=> (
                      <button key={idx} onClick={()=>handleImageSelect(opt)} className="card hover:ring-2 hover:ring-primary">
                        <img src={opt.src} alt={opt.label} className="w-24 h-24 mx-auto" />
                        <div className="mt-2 text-center text-sm">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 text-center">Skor gambar sementara: {(imageAcc*100).toFixed(0)}%</div>
                </div>
              ) : (
                <>
                  <div className="text-center py-12 bg-blue-50 rounded-xl">
                    <div className="text-6xl font-bold text-primary">{it.prompt}</div>
                  </div>
                  <input 
                    className="w-full border-2 rounded-lg px-4 py-3 text-lg text-center font-semibold" 
                    placeholder={it.placeholder} 
                    value={answers[it.clientId]||''} 
                    onChange={e=>setAnswers({...answers, [it.clientId]: e.target.value})}
                    disabled={loading}
                    onFocus={recordReaction}
                  />
                </>
              )}
            </div>
          )}
          
          <div className="flex justify-between">
            <button 
              onClick={()=>{recordReaction(); prev()}} 
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300" 
              disabled={step === 0 || loading}
            >
              Kembali
            </button>
            {step < items.length-1 ? (
              <button onClick={()=>{recordReaction(); next()}} className="btn" disabled={loading}>Lanjut</button>
            ) : (
              <button onClick={submit} className="btn" disabled={loading}>
                {loading ? 'Mengirim...' : 'Selesai'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
