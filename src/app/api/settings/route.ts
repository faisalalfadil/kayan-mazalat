import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      settings = await db.siteSettings.create({ data: {} })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحميل الإعدادات' },
      { status: 500 }
    )
  }
}
