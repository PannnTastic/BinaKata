import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    
    const children = await prisma.child.findMany({
      where: { parentId: payload.userId },
      include: {
        assessments: {
          where: { submittedAt: { not: null } }
        }
      }
    })
    
    let totalAssessments = 0
    let totalRisk = 0
    let assessmentCount = 0
    
    for (const child of children) {
      totalAssessments += child.assessments.length
      for (const assessment of child.assessments) {
        if (assessment.riskScore !== null) {
          totalRisk += assessment.riskScore
          assessmentCount++
        }
      }
    }
    
    return NextResponse.json({
      total_assessments: totalAssessments,
      average_risk: assessmentCount > 0 ? totalRisk / assessmentCount : null
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}