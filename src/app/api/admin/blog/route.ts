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
      include: {
        category: true,
        tags: true,
      },
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
        author: author || 'كيان القمة',
        published: published ?? false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        focusKeyword: focusKeyword || null,
        keywords: keywords || null,
        readingTime: readingTime || null,
        wordCount: wordCount || null,
        seoScore: seoScore || null,
        featuredImageAlt: featuredImageAlt || null,
        categoryId: categoryId || null,
        publishedAt: published ? new Date() : null,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        category: true,
        tags: true,
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
