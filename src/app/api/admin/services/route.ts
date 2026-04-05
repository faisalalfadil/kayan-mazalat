import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Services fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الخدمات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, titleEn, description, descriptionEn, icon, image, order, isActive } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'العنوان والوصف مطلوبان' },
        { status: 400 }
      )
    }

    const service = await db.service.create({
      data: {
        title,
        titleEn: titleEn || null,
        description,
        descriptionEn: descriptionEn || null,
        icon: icon || '',
        image: image || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Service create error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الخدمة' },
      { status: 500 }
    )
  }
}
