import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const where: Record<string, boolean> = { isActive: true };
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const projects = await db.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب المشاريع', projects: [] },
      { status: 500 }
    );
  }
}
