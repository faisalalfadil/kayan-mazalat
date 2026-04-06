import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, titleEn, slug, description, descriptionEn, icon, image, order, isActive, content } = body

    // Build service update data
    const serviceData: Record<string, unknown> = {
      ...(title !== undefined && { title }),
      ...(titleEn !== undefined && { titleEn: titleEn || null }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(descriptionEn !== undefined && { descriptionEn: descriptionEn || null }),
      ...(icon !== undefined && { icon }),
      ...(image !== undefined && { image: image || null }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive }),
    }

    // Handle content update if provided
    if (content) {
      const contentData = {
        heroTagline: content.heroTagline || '',
        overview: typeof content.overview === 'string' ? content.overview : JSON.stringify(content.overview || []),
        stats: typeof content.stats === 'string' ? content.stats : JSON.stringify(content.stats || []),
        features: typeof content.features === 'string' ? content.features : JSON.stringify(content.features || []),
        advantages: typeof content.advantages === 'string' ? content.advantages : JSON.stringify(content.advantages || []),
        faqs: typeof content.faqs === 'string' ? content.faqs : JSON.stringify(content.faqs || []),
      }

      // Upsert the content record
      await db.serviceContent.upsert({
        where: { serviceId: id },
        update: contentData,
        create: { serviceId: id, ...contentData },
      })
    }

    const service = await db.service.update({
      where: { id },
      data: serviceData,
      include: { content: true },
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
