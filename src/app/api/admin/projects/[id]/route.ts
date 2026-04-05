import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, titleEn, description, descriptionEn, image, images, location, client, completedAt, isFeatured, isActive } = body

    const project = await db.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(titleEn !== undefined && { titleEn: titleEn || null }),
        ...(description !== undefined && { description }),
        ...(descriptionEn !== undefined && { descriptionEn: descriptionEn || null }),
        ...(image !== undefined && { image }),
        ...(images !== undefined && { images: images || null }),
        ...(location !== undefined && { location: location || null }),
        ...(client !== undefined && { client: client || null }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المشروع' },
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
    const project = await db.project.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error('Project delete error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المشروع' },
      { status: 500 }
    )
  }
}
