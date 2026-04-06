import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      image,
      author,
      published,
      metaTitle,
      metaDescription,
      focusKeyword,
      keywords,
      readingTime,
      wordCount,
      seoScore,
      featuredImageAlt,
      categoryId,
      tagIds,
    } = body

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt: excerpt || null }),
        ...(content !== undefined && { content }),
        ...(image !== undefined && { image: image || null }),
        ...(author !== undefined && { author }),
        ...(published !== undefined && {
          published,
          publishedAt: published ? new Date() : null,
        }),
        ...(metaTitle !== undefined && { metaTitle: metaTitle || null }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription || null }),
        ...(focusKeyword !== undefined && { focusKeyword: focusKeyword || null }),
        ...(keywords !== undefined && { keywords: keywords || null }),
        ...(readingTime !== undefined && { readingTime }),
        ...(wordCount !== undefined && { wordCount }),
        ...(seoScore !== undefined && { seoScore }),
        ...(featuredImageAlt !== undefined && { featuredImageAlt: featuredImageAlt || null }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(tagIds !== undefined && {
          tags: {
            set: [],
            connect: tagIds.map((tagId: string) => ({ id: tagId })),
          },
        }),
      },
      include: {
        category: true,
        tags: true,
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
