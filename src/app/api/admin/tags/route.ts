import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الوسوم' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.tag.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'الرابط مستخدم بالفعل' },
        { status: 400 }
      )
    }

    const tag = await db.tag.create({
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json({ success: true, tag })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الوسم' },
      { status: 500 }
    )
  }
}
