import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب التصنيفات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, image } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.category.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'الرابط مستخدم بالفعل' },
        { status: 400 }
      )
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء التصنيف' },
      { status: 500 }
    )
  }
}
