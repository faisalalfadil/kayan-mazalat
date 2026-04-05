import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSlug(title: string): string {
  return title
    .replace(/\s+/g, '-')
    .replace(/[^\u0621-\u064Aa-zA-Z0-9-]/g, '')
    .toLowerCase()
    .substring(0, 100) + '-' + Date.now().toString(36)
}

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Blog fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المقالات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content, image, images, author, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى مطلوبان' },
        { status: 400 }
      )
    }

    const slug = generateSlug(title)

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image: image || null,
        images: images || null,
        author: author || 'كيان القمة',
        published: published ?? false,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Blog create error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المقال' },
      { status: 500 }
    )
  }
}
