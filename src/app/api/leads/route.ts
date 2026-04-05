import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message, type } = body;

    // Validate required fields
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'الاسم ورقم الهاتف والرسالة مطلوبان' },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        name,
        email: email || null,
        phone,
        company: company || null,
        service: service || null,
        message,
        type: type || 'contact',
        status: 'new',
      },
    });

    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب' },
      { status: 500 }
    );
  }
}
