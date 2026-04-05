import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const leads = await db.lead.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب طلبات العملاء' },
      { status: 500 }
    )
  }
}
