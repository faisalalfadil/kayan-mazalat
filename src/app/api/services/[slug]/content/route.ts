import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const service = await db.service.findUnique({
      where: { slug },
      include: { content: true },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'الخدمة غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json({ content: service.content })
  } catch (error) {
    console.error('Service content fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب محتوى الخدمة' },
      { status: 500 }
    )
  }
}
