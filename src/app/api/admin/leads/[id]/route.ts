import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'الحالة مطلوبة' },
        { status: 400 }
      )
    }

    const lead = await db.lead.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Lead update error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الطلب' },
      { status: 500 }
    )
  }
}
