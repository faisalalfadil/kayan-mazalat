import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المشاريع' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, titleEn, description, descriptionEn, image, images, location, client, completedAt, isFeatured, isActive } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'العنوان والوصف مطلوبان' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        title,
        titleEn: titleEn || null,
        description,
        descriptionEn: descriptionEn || null,
        image: image || '',
        images: images || null,
        location: location || null,
        client: client || null,
        completedAt: completedAt ? new Date(completedAt) : null,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Project create error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المشروع' },
      { status: 500 }
    )
  }
}
