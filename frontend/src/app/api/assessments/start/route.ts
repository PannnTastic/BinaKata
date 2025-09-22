import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const LETTER_ITEMS = ['A', 'B', 'D', 'P']
const WORD_ITEMS = ['Paku', 'Baku', 'Kuda', 'Buku']
const ARRANGE_ITEMS = [{ prompt: 'K U C I N G', target: 'KUCING' }]

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    
    const { child_id } = await req.json()
    
    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: child_id, parentId: payload.userId }
    })
    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    
    // Create assessment with items
    const assessment = await prisma.assessment.create({
      data: {
        childId: child.id,
        items: {
          create: [
            ...LETTER_ITEMS.map((letter, i) => ({
              itemType: 'letter',
              prompt: letter,
              position: i
            })),
            ...WORD_ITEMS.map((word, i) => ({
              itemType: 'word',
              prompt: word,
              position: LETTER_ITEMS.length + i
            })),
            ...ARRANGE_ITEMS.map((item, i) => ({
              itemType: 'arrange',
              prompt: `${item.prompt} -> ${item.target}`,
              position: LETTER_ITEMS.length + WORD_ITEMS.length + i
            }))
          ]
        }
      }
    })
    
    return NextResponse.json({ assessment_id: assessment.id })
  } catch (error) {
    console.error('Start assessment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}