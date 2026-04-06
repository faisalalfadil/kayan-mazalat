import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await db.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    const result = sessions.map((session) => ({
      id: session.id,
      sessionId: session.sessionId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lastMessage: session.messages[0] || null,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chat sessions fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المحادثات' },
      { status: 500 }
    )
  }
}
