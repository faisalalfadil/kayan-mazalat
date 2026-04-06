import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, titleEn, slug, description, descriptionEn, icon, image, order, isActive } = body

    const service = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(titleEn !== undefined && { titleEn: titleEn || null }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(descriptionEn !== undefined && { descriptionEn: descriptionEn || null }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image: image || null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Service update error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الخدمة' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await db.service.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Service delete error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الخدمة' },
      { status: 500 }
    )
  }
}
