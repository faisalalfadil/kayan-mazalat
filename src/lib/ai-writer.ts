interface AIWriterOptions {
  temperature?: number;
  maxTokens?: number;
}

export async function generateTitles(
  keyword: string,
  contentBrief?: string,
  options: AIWriterOptions = {}
): Promise<string[]> {
  const prompt = `أنت خبير في كتابة عناوين المقالات المتوافقة مع السيو.

الكلمة المفتاحية: ${keyword}
${contentBrief ? `موضوع المقالة: ${contentBrief}` : ''}

اكتب 8 عناوين جذابة ومتوافقة مع السيو للمقالة. يجب أن تكون العناوين:
- تحتوي على الكلمة المفتاحية
- طولها بين 50-60 حرف
- جذابة وتشجع على النقر
- تستخدم أرقام أو كلمات قوية عندما يكون ذلك مناسباً
- باللغة العربية

أعطني فقط العناوين، كل عنوان في سطر منفصل، بدون ترقيم أو شرح.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
      }),
    });

    if (!response.ok) throw new Error('فشل في توليد العناوين');

    const data = await response.json();
    const titles = data.response
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^[-•*]\s*/, '').trim());

    return titles;
  } catch (error) {
    console.error('Error generating titles:', error);
    throw error;
  }
}

export async function generateOutline(
  keyword: string,
  contentBrief?: string,
  options: AIWriterOptions = {}
): Promise<string> {
  const prompt = `أنت خبير في كتابة المقالات المتوافقة مع السيو.

الكلمة المفتاحية: ${keyword}
${contentBrief ? `موضوع المقالة: ${contentBrief}` : ''}

اكتب مخططاً تفصيلياً لمقالة شاملة حول هذا الموضوع. يجب أن يتضمن المخطط:
- مقدمة جذابة
- 5-7 عناوين رئيسية (H2)
- 2-3 عناوين فرعية تحت كل عنوان رئيسي (H3)
- خاتمة
- أسئلة شائعة (3-5 أسئلة)

استخدم تنسيق Markdown للعناوين (##، ###).`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      }),
    });

    if (!response.ok) throw new Error('فشل في توليد المخطط');

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
}

export async function expandSection(
  sectionTitle: string,
  keyword: string,
  context?: string,
  options: AIWriterOptions = {}
): Promise<string> {
  const prompt = `أنت كاتب محتوى محترف متخصص في كتابة المقالات المتوافقة مع السيو.

عنوان القسم: ${sectionTitle}
الكلمة المفتاحية: ${keyword}
${context ? `السياق: ${context}` : ''}

اكتب محتوى تفصيلياً لهذا القسم (200-300 كلمة). يجب أن يكون المحتوى:
- غنياً بالمعلومات ومفيداً للقارئ
- يحتوي على الكلمة المفتاحية بشكل طبيعي
- مكتوباً بأسلوب واضح وسهل الفهم
- منظماً في فقرات قصيرة
- يستخدم أمثلة عملية عندما يكون ذلك مناسباً
- باللغة العربية الفصحى

استخدم تنسيق Markdown للتنسيق (bold، lists، إلخ).`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 800,
      }),
    });

    if (!response.ok) throw new Error('فشل في توليد المحتوى');

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error expanding section:', error);
    throw error;
  }
}

export async function generateIntroduction(
  title: string,
  keyword: string,
  options: AIWriterOptions = {}
): Promise<string> {
  const prompt = `أنت كاتب محتوى محترف.

عنوان المقالة: ${title}
الكلمة المفتاحية: ${keyword}

اكتب مقدمة جذابة للمقالة (100-150 كلمة). يجب أن تكون المقدمة:
- تجذب انتباه القارئ من السطر الأول
- تحتوي على الكلمة المفتاحية في الفقرة الأولى
- توضح ما سيتعلمه القارئ من المقالة
- تشجع على مواصلة القراءة
- باللغة العربية الفصحى

استخدم تنسيق Markdown.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 400,
      }),
    });

    if (!response.ok) throw new Error('فشل في توليد المقدمة');

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating introduction:', error);
    throw error;
  }
}

export async function generateConclusion(
  title: string,
  keyword: string,
  mainPoints?: string[],
  options: AIWriterOptions = {}
): Promise<string> {
  const prompt = `أنت كاتب محتوى محترف.

عنوان المقالة: ${title}
الكلمة المفتاحية: ${keyword}
${mainPoints && mainPoints.length > 0 ? `النقاط الرئيسية:\n${mainPoints.map(p => `- ${p}`).join('\n')}` : ''}

اكتب خاتمة قوية للمقالة (100-150 كلمة). يجب أن تكون الخاتمة:
- تلخص النقاط الرئيسية
- تحتوي على دعوة لاتخاذ إجراء (call to action)
- تترك انطباعاً إيجابياً لدى القارئ
- باللغة العربية الفصحى

استخدم تنسيق Markdown.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 400,
      }),
    });

    if (!response.ok) throw new Error('فشل في توليد الخاتمة');

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating conclusion:', error);
    throw error;
  }
}

export async function generateMetaDescription(
  title: string,
  keyword: string,
  contentSummary?: string,
  options: AIWriterOptions = {}
): Promise<string> {
  const prompt = `أنت خبير في كتابة الأوصاف التعريفية (meta descriptions) المتوافقة مع السيو.

عنوان المقالة: ${title}
الكلمة المفتاحية: ${keyword}
${contentSummary ? `ملخص المحتوى: ${contentSummary}` : ''}

اكتب وصفاً تعريفياً جذاباً للمقالة. يجب أن يكون الوصف:
- طوله بين 150-160 حرف بالضبط
- يحتوي على الكلمة المفتاحية
- يشجع على النقر
- يلخص محتوى المقالة بشكل واضح
- باللغة العربية

أعطني فقط الوصف التعريفي، بدون أي شرح أو نص إضافي.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 200,
      }),
    });

    if (!response.ok) throw new Error('فشل في توليد الوصف التعريفي');

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error('Error generating meta description:', error);
    throw error;
  }
}

export async function improveContent(
  content: string,
  improvementType: 'clarity' | 'readability' | 'seo' | 'grammar',
  keyword?: string,
  options: AIWriterOptions = {}
): Promise<string> {
  const prompts = {
    clarity: 'أعد كتابة النص التالي لجعله أكثر وضوحاً وسهولة في الفهم، مع الحفاظ على المعنى الأصلي',
    readability: 'أعد كتابة النص التالي لتحسين سهولة القراءة: استخدم جملاً أقصر، فقرات أصغر، وكلمات انتقالية',
    seo: `أعد كتابة النص التالي لتحسين السيو: استخدم الكلمة المفتاحية "${keyword}" بشكل طبيعي، أضف كلمات مفتاحية ذات صلة، وحسّن البنية`,
    grammar: 'صحح الأخطاء النحوية والإملائية في النص التالي، مع الحفاظ على الأسلوب والمعنى',
  };

  const prompt = `${prompts[improvementType]}:

${content}

أعطني النص المحسّن فقط، بدون أي شرح أو تعليقات.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.5,
        max_tokens: options.maxTokens || 1000,
      }),
    });

    if (!response.ok) throw new Error('فشل في تحسين المحتوى');

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error improving content:', error);
    throw error;
  }
}

export async function suggestKeywords(
  mainKeyword: string,
  options: AIWriterOptions = {}
): Promise<string[]> {
  const prompt = `أنت خبير في البحث عن الكلمات المفتاحية للسيو.

الكلمة المفتاحية الرئيسية: ${mainKeyword}

اقترح 10 كلمات مفتاحية ذات صلة (LSI keywords) يمكن استخدامها في المقالة. يجب أن تكون:
- مرتبطة بالكلمة المفتاحية الرئيسية
- متنوعة (كلمات قصيرة وطويلة)
- مفيدة للسيو
- باللغة العربية

أعطني فقط الكلمات المفتاحية، كل كلمة في سطر منفصل، بدون ترقيم أو شرح.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 300,
      }),
    });

    if (!response.ok) throw new Error('فشل في اقتراح الكلمات المفتاحية');

    const data = await response.json();
    const keywords = data.response
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^[-•*]\s*/, '').trim());

    return keywords;
  } catch (error) {
    console.error('Error suggesting keywords:', error);
    throw error;
  }
}
