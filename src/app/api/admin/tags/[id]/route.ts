import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      )
    }

    // Check if slug is used by another tag
    const existing = await db.tag.findFirst({
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

    const tag = await db.tag.update({
      where: { id: params.id },
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json({ success: true, tag })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الوسم' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if tag has posts
    const tag = await db.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!tag) {
      return NextResponse.json(
        { success: false, error: 'الوسم غير موجود' },
        { status: 404 }
      )
    }

    if (tag._count.posts > 0) {
      return NextResponse.json(
        { success: false, error: `لا يمكن حذف الوسم لأنه مستخدم في ${tag._count.posts} مقالة` },
        { status: 400 }
      )
    }

    await db.tag.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الوسم' },
      { status: 500 }
    )
  }
}
