import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `أنت مساعد ذكي لشركة كيان القمة المتخصصة في توريد وتركيب الساندوتش بانل في المملكة العربية السعودية. أجب باللغة العربية. كن ودوداً ومحترفاً.

معلومات عن الشركة:
- شركة كيان القمة متخصصة في توريد وتركيب الساندوتش بانل
- خبرة أكثر من 15 عاماً
- تخدم جميع مناطق المملكة العربية السعودية (الرياض، جدة، الدمام، وغيرها)
- الخدمات: توريد وتركيب ساندوتش بانل، عزل حراري، بناء هناجر ومستودعات، مباني صناعية، أعمال الصاج

أسعار تقريبية للساندوتش بانل (لكل متر مربع):
- ساندوتش بانل 40mm: 95-110 ريال
- ساندوتش بانل 50mm: 105-120 ريال
- ساندوتش بانل 60mm: 115-130 ريال
- ساندوتش بانل 75mm: 130-145 ريال
- ساندوتش بانل 80mm: 140-155 ريال
- ساندوتش بانل 100mm: 160-180 ريال
- ساندوتش بانل 120mm: 185-205 ريال
- ساندوتش بانل 150mm: 220-250 ريال
- ساندوتش بانل 200mm: 280-320 ريال

مدة التنفيذ:
- المشاريع الصغيرة (أقل من 500م²): 1-2 أسبوع
- المشاريع المتوسطة (500-2000م²): 2-4 أسابيع
- المشاريع الكبيرة (أكثر من 2000م²): حسب حجم المشروع

ملاحظة: الأسعار تقريبية وقد تختلف حسب المواصفات والكمية. للحصول على عرض سعر دقيق، يرجى التواصل معنا.
رقم الهاتف: 966500000000+
البريد الإلكتروني: info@kayan-alfama.com`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId: existingSessionId } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'الرجاء إدخال رسالة' },
        { status: 400 }
      );
    }

    // Limit message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'الرسالة طويلة جداً. الرجاء تقصيرها.' },
        { status: 400 }
      );
    }

    const sessionId = existingSessionId || uuidv4();

    // Create session if new
    if (!existingSessionId) {
      await db.chatSession.create({
        data: { sessionId },
      });
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: message.trim(),
      },
    });

    // Update session timestamp
    await db.chatSession.update({
      where: { sessionId },
      data: { updatedAt: new Date() },
    });

    // Fetch chat history (last 20 messages for context)
    const chatHistory = await db.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Build messages array for AI
    const aiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...chatHistory.map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Call z-ai-web-dev-sdk
    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      model: 'deepseek-chat',
      messages: aiMessages,
    });

    const assistantMessage =
      response?.choices?.[0]?.message?.content ||
      response?.message?.content ||
      'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.';

    // Save assistant message
    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: assistantMessage,
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      sessionId,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Save error message to DB if we have a sessionId
    const errorResponse = NextResponse.json(
      {
        error: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً.',
        message: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً.',
      },
      { status: 500 }
    );

    return errorResponse;
  }
}
