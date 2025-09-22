import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    
    const { assessment_id, answers } = await req.json()
    
    // Get assessment with items
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessment_id },
      include: { items: { orderBy: { position: 'asc' } } }
    })
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    
    // Score answers
    let correctLetters = 0, totalLetters = 0
    let correctWords = 0, totalWords = 0
    let correctArrange = 0, totalArrange = 0
    
    for (let i = 0; i < assessment.items.length; i++) {
      const item = assessment.items[i]
      const answer = answers[i]?.answer || ''
      
      let isCorrect = false
      if (item.itemType === 'letter') {
        totalLetters++
        isCorrect = answer.trim().toUpperCase() === item.prompt.trim().toUpperCase()
        if (isCorrect) correctLetters++
      } else if (item.itemType === 'word') {
        totalWords++
        isCorrect = answer.trim().toLowerCase() === item.prompt.trim().toLowerCase()
        if (isCorrect) correctWords++
      } else if (item.itemType === 'arrange') {
        totalArrange++
        const target = item.prompt.split('->')[1]?.trim() || ''
        isCorrect = answer.replace(/\s/g, '').toUpperCase() === target.toUpperCase()
        if (isCorrect) correctArrange++
      }
      
      // Update item with answer
      await prisma.assessmentItem.update({
        where: { id: item.id },
        data: { answer, isCorrect }
      })
    }
    
    // Calculate accuracy scores
    const lettersAcc = totalLetters > 0 ? correctLetters / totalLetters : 0
    const wordsAcc = totalWords > 0 ? correctWords / totalWords : 0
    const arrangeAcc = totalArrange > 0 ? correctArrange / totalArrange : 0

    // Optional extra metrics (collected in client via localStorage during screening)
    let speechAcc = 0.5
    let imageAcc = 0.5
    let avgReactionTime = 2.0
    try {
      const extraRaw = (global as any)._binakata_extra_metrics as string | undefined
      const extra = extraRaw ? JSON.parse(extraRaw) : undefined
      if (extra) {
        if (typeof extra.speechAcc === 'number') speechAcc = extra.speechAcc
        if (typeof extra.imageAcc === 'number') imageAcc = extra.imageAcc
        if (typeof extra.avgReactionTime === 'number') avgReactionTime = extra.avgReactionTime
      }
    } catch {}
    
    // Call Python ML service for risk scoring
    let riskScore = 0.5
    let recommendation = 'Risiko sedang: fokuskan latihan ejaan interaktif.'
    
    try {
      const mlResponse = await fetch(`${process.env.ML_SERVICE_URL || 'http://localhost:8001'}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letters_accuracy: lettersAcc,
          words_accuracy: wordsAcc,
          arrange_accuracy: arrangeAcc,
          speech_accuracy: speechAcc,
          image_accuracy: imageAcc,
          avg_reaction_time: avgReactionTime
        })
      })
      
      if (mlResponse.ok) {
        const mlData = await mlResponse.json()
        riskScore = mlData.risk_score
        recommendation = mlData.recommendation
      }
    } catch (mlError) {
      console.log('ML service unavailable, using fallback scoring')
      // Fallback heuristic scoring with extra features
      const avgAcc = (lettersAcc + wordsAcc + arrangeAcc + speechAcc + imageAcc) / 5
      const rtPenalty = Math.max(0, (avgReactionTime - 2.0) / 5)
      riskScore = Math.min(1, Math.max(0, 1 - avgAcc + rtPenalty))
      
      if (riskScore >= 0.7) {
        recommendation = 'Risiko tinggi: rujuk evaluasi profesional; mulai modul huruf dasar.'
      } else if (riskScore >= 0.4) {
        recommendation = 'Risiko sedang: fokuskan latihan ejaan interaktif dan susun kata.'
      } else {
        recommendation = 'Risiko rendah: lanjutkan latihan bertahap dan pemantauan.'
      }
    }
    
    // Update assessment with results
    await prisma.assessment.update({
      where: { id: assessment_id },
      data: {
        submittedAt: new Date(),
        riskScore,
        recommendation
      }
    })
    
    return NextResponse.json({
      id: assessment_id,
      risk_score: riskScore,
      recommendation
    })
  } catch (error) {
    console.error('Submit assessment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}