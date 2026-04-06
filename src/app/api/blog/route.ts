import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');

    if (slug) {
      // Get a single post by slug
      const post = await db.blogPost.findUnique({
        where: { slug, published: true },
      });

      if (!post) {
        return NextResponse.json(
          { success: false, error: 'المقال غير موجود' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, post });
    }

    // Get published posts with optional limit
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit, 10) : 3,
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب المقالات', posts: [] },
      { status: 500 }
    );
  }
}
