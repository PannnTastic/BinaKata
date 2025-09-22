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
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(children)
  } catch (error) {
    console.error('Get children error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    
    const { name, age } = await req.json()
    
    const child = await prisma.child.create({
      data: {
        parentId: payload.userId,
        name,
        age: age ? parseInt(age) : null
      }
    })
    
    return NextResponse.json(child)
  } catch (error) {
    console.error('Create child error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}