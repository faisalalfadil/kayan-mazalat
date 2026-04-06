import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      settings = await db.siteSettings.create({ data: {} })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Admin settings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحميل الإعدادات' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      settings = await db.siteSettings.create({ data: body })
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: body,
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الإعدادات' },
      { status: 500 }
    )
  }
}
