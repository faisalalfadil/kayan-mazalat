import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [services, projects, leads, blogPosts] = await Promise.all([
      db.service.count({ where: { isActive: true } }),
      db.project.count({ where: { isActive: true } }),
      db.lead.count(),
      db.blogPost.count(),
    ])

    const recentLeads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json({
      services,
      projects,
      leads,
      blogPosts,
      recentLeads,
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
