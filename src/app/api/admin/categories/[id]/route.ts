import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, slug, description, image } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      )
    }

    // Check if slug is used by another category
    const existing = await db.category.findFirst({
      where: {
        slug,
        NOT: { id: params.id },
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'الرابط مستخدم بالفعل' },
        { status: 400 }
      )
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        image,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث التصنيف' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if category has posts
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'التصنيف غير موجود' },
        { status: 404 }
      )
    }

    if (category._count.posts > 0) {
      return NextResponse.json(
        { success: false, error: `لا يمكن حذف التصنيف لأنه يحتوي على ${category._count.posts} مقالة` },
        { status: 400 }
      )
    }

    await db.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف التصنيف' },
      { status: 500 }
    )
  }
}
