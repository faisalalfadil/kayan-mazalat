import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `أنت مساعد ذكي لشركة كيان القمة المتخصصة في المظلات الكهربائية وبديل الشيبود والديكورات الداخلية في المملكة العربية السعودية. أجب باللغة العربية. كن ودوداً ومحترفاً.

الخدمات الرئيسية:
- المظلات الكهربائية المتحركة (مظلات كاسيت، مظلات ذراع مفصلي، مظلات بيرجولا، مظلات مواقف سيارات)
- بديل الشيبود (ألواح للجدران والأسقف، تصاميم ثلاثية الأبعاد، إضاءة LED مخفية)
- الديكورات الداخلية المتكاملة (بديل خشب، بديل رخام، باركيه SPC، جبس بورد، ورق جدران، مرايا، خلفيات تلفزيون)

- شركة كيان القمة لديها خبرة أكثر من 15 عاماً
- الهاتف: 0537639422
- الواتساب: 966537639422
- نقدم معاينة مجانية وضمان شامل

إذا سأل المستخدم عن أسعار، قل أن الأسعار تختلف حسب نوع الخدمة والمساحة والمواد المستخدمة، ويمكنه طلب عرض سعر مجاني عبر الواتساب أو الاتصال بنا.`;

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

    // Call OpenRouter API directly
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kayan-mazalat.com',
        'X-Title': 'Kayan Mazalat Chatbot',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: aiMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data?.choices?.[0]?.message?.content || 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.';

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
