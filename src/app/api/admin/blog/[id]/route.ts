import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, excerpt, content, image, images, author, published } = body

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt: excerpt || null }),
        ...(content !== undefined && { content }),
        ...(image !== undefined && { image: image || null }),
        ...(images !== undefined && { images: images || null }),
        ...(author !== undefined && { author }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Blog update error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المقال' },
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
    await db.blogPost.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog delete error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المقال' },
      { status: 500 }
    )
  }
}
