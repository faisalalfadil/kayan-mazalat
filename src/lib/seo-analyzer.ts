export interface SEOAnalysis {
  score: number;
  checks: SEOCheck[];
  suggestions: string[];
}

export interface SEOCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  weight: number;
}

export function analyzeSEO(
  title: string,
  content: string,
  metaTitle?: string,
  metaDescription?: string,
  focusKeyword?: string,
  slug?: string
): SEOAnalysis {
  const checks: SEOCheck[] = [];
  const suggestions: string[] = [];

  // Content analysis
  const wordCount = countWords(content);
  const readingTime = Math.ceil(wordCount / 200);
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  const headings = extractHeadings(content);

  // 1. Word Count Check (10%)
  if (wordCount >= 1500) {
    checks.push({
      name: 'عدد الكلمات',
      status: 'success',
      message: `ممتاز! المقالة تحتوي على ${wordCount} كلمة`,
      weight: 10,
    });
  } else if (wordCount >= 800) {
    checks.push({
      name: 'عدد الكلمات',
      status: 'warning',
      message: `جيد، لكن يفضل زيادة المحتوى (${wordCount} كلمة حالياً)`,
      weight: 10,
    });
    suggestions.push('أضف المزيد من المحتوى للوصول إلى 1500 كلمة على الأقل');
  } else {
    checks.push({
      name: 'عدد الكلمات',
      status: 'error',
      message: `المحتوى قصير جداً (${wordCount} كلمة فقط)`,
      weight: 10,
    });
    suggestions.push('المقالات الطويلة (1500+ كلمة) تحصل على ترتيب أفضل في محركات البحث');
  }

  // 2. Title Length Check (10%)
  const titleToCheck = metaTitle || title;
  const titleLength = titleToCheck.length;
  if (titleLength >= 50 && titleLength <= 60) {
    checks.push({
      name: 'طول العنوان',
      status: 'success',
      message: `طول العنوان مثالي (${titleLength} حرف)`,
      weight: 10,
    });
  } else if (titleLength >= 40 && titleLength <= 70) {
    checks.push({
      name: 'طول العنوان',
      status: 'warning',
      message: `طول العنوان مقبول (${titleLength} حرف)`,
      weight: 10,
    });
    suggestions.push('الطول المثالي للعنوان هو 50-60 حرف');
  } else {
    checks.push({
      name: 'طول العنوان',
      status: 'error',
      message: `طول العنوان غير مناسب (${titleLength} حرف)`,
      weight: 10,
    });
    suggestions.push(titleLength < 40 ? 'العنوان قصير جداً، أضف المزيد من التفاصيل' : 'العنوان طويل جداً، اختصره إلى 50-60 حرف');
  }

  // 3. Meta Description Check (10%)
  if (metaDescription) {
    const descLength = metaDescription.length;
    if (descLength >= 150 && descLength <= 160) {
      checks.push({
        name: 'الوصف التعريفي',
        status: 'success',
        message: `طول الوصف مثالي (${descLength} حرف)`,
        weight: 10,
      });
    } else if (descLength >= 120 && descLength <= 180) {
      checks.push({
        name: 'الوصف التعريفي',
        status: 'warning',
        message: `طول الوصف مقبول (${descLength} حرف)`,
        weight: 10,
      });
      suggestions.push('الطول المثالي للوصف التعريفي هو 150-160 حرف');
    } else {
      checks.push({
        name: 'الوصف التعريفي',
        status: 'error',
        message: `طول الوصف غير مناسب (${descLength} حرف)`,
        weight: 10,
      });
      suggestions.push(descLength < 120 ? 'الوصف قصير جداً، أضف المزيد من التفاصيل' : 'الوصف طويل جداً، اختصره إلى 150-160 حرف');
    }
  } else {
    checks.push({
      name: 'الوصف التعريفي',
      status: 'error',
      message: 'الوصف التعريفي مفقود',
      weight: 10,
    });
    suggestions.push('أضف وصفاً تعريفياً جذاباً (150-160 حرف)');
  }

  // 4. Focus Keyword Analysis (15%)
  if (focusKeyword) {
    const keywordDensity = calculateKeywordDensity(content, focusKeyword);
    const keywordInTitle = titleToCheck.toLowerCase().includes(focusKeyword.toLowerCase());
    const keywordInFirstParagraph = paragraphs[0]?.toLowerCase().includes(focusKeyword.toLowerCase());
    const keywordInHeadings = headings.some(h => h.toLowerCase().includes(focusKeyword.toLowerCase()));
    const keywordInSlug = slug?.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, '-'));

    if (keywordDensity >= 1 && keywordDensity <= 2) {
      checks.push({
        name: 'كثافة الكلمة المفتاحية',
        status: 'success',
        message: `كثافة مثالية (${keywordDensity.toFixed(2)}%)`,
        weight: 15,
      });
    } else if (keywordDensity >= 0.5 && keywordDensity <= 3) {
      checks.push({
        name: 'كثافة الكلمة المفتاحية',
        status: 'warning',
        message: `كثافة مقبولة (${keywordDensity.toFixed(2)}%)`,
        weight: 15,
      });
      suggestions.push(keywordDensity < 1 ? 'استخدم الكلمة المفتاحية بشكل أكثر' : 'قلل من استخدام الكلمة المفتاحية لتجنب الحشو');
    } else {
      checks.push({
        name: 'كثافة الكلمة المفتاحية',
        status: 'error',
        message: `كثافة غير مناسبة (${keywordDensity.toFixed(2)}%)`,
        weight: 15,
      });
      suggestions.push(keywordDensity < 0.5 ? 'الكلمة المفتاحية نادرة جداً في المحتوى' : 'حشو الكلمات المفتاحية يضر بالسيو');
    }

    // Keyword placement checks
    if (!keywordInTitle) {
      suggestions.push('أضف الكلمة المفتاحية في العنوان');
    }
    if (!keywordInFirstParagraph) {
      suggestions.push('أضف الكلمة المفتاحية في الفقرة الأولى');
    }
    if (!keywordInHeadings) {
      suggestions.push('استخدم الكلمة المفتاحية في أحد العناوين الفرعية');
    }
    if (!keywordInSlug) {
      suggestions.push('أضف الكلمة المفتاحية في رابط المقالة (slug)');
    }
  } else {
    checks.push({
      name: 'الكلمة المفتاحية',
      status: 'error',
      message: 'لم يتم تحديد كلمة مفتاحية',
      weight: 15,
    });
    suggestions.push('حدد كلمة مفتاحية رئيسية للمقالة');
  }

  // 5. Headings Structure (10%)
  const h1Count = headings.filter(h => h.startsWith('# ')).length;
  const hasSubheadings = headings.length > 1;

  if (h1Count === 1 && hasSubheadings) {
    checks.push({
      name: 'بنية العناوين',
      status: 'success',
      message: `بنية عناوين ممتازة (${headings.length} عنوان)`,
      weight: 10,
    });
  } else if (h1Count === 0) {
    checks.push({
      name: 'بنية العناوين',
      status: 'error',
      message: 'لا يوجد عنوان رئيسي (H1)',
      weight: 10,
    });
    suggestions.push('أضف عنواناً رئيسياً واحداً (H1) للمقالة');
  } else if (h1Count > 1) {
    checks.push({
      name: 'بنية العناوين',
      status: 'warning',
      message: `يوجد أكثر من عنوان رئيسي (${h1Count})`,
      weight: 10,
    });
    suggestions.push('استخدم عنواناً رئيسياً واحداً فقط (H1)');
  } else if (!hasSubheadings) {
    checks.push({
      name: 'بنية العناوين',
      status: 'warning',
      message: 'لا توجد عناوين فرعية',
      weight: 10,
    });
    suggestions.push('أضف عناوين فرعية (H2, H3) لتنظيم المحتوى');
  }

  // 6. Paragraph Length (5%)
  const longParagraphs = paragraphs.filter(p => countWords(p) > 150);
  if (longParagraphs.length === 0) {
    checks.push({
      name: 'طول الفقرات',
      status: 'success',
      message: 'جميع الفقرات بطول مناسب',
      weight: 5,
    });
  } else {
    checks.push({
      name: 'طول الفقرات',
      status: 'warning',
      message: `${longParagraphs.length} فقرة طويلة جداً`,
      weight: 5,
    });
    suggestions.push('قسّم الفقرات الطويلة (أكثر من 150 كلمة) إلى فقرات أصغر');
  }

  // 7. Internal/External Links (10%)
  const links = extractLinks(content);
  const internalLinks = links.filter(l => !l.startsWith('http'));
  const externalLinks = links.filter(l => l.startsWith('http'));

  if (internalLinks.length >= 2 && externalLinks.length >= 1) {
    checks.push({
      name: 'الروابط',
      status: 'success',
      message: `روابط جيدة (${internalLinks.length} داخلية، ${externalLinks.length} خارجية)`,
      weight: 10,
    });
  } else if (internalLinks.length >= 1 || externalLinks.length >= 1) {
    checks.push({
      name: 'الروابط',
      status: 'warning',
      message: `روابط قليلة (${internalLinks.length} داخلية، ${externalLinks.length} خارجية)`,
      weight: 10,
    });
    if (internalLinks.length < 2) {
      suggestions.push('أضف 2-3 روابط داخلية لمقالات أخرى في موقعك');
    }
    if (externalLinks.length < 1) {
      suggestions.push('أضف رابطاً خارجياً واحداً على الأقل لمصدر موثوق');
    }
  } else {
    checks.push({
      name: 'الروابط',
      status: 'error',
      message: 'لا توجد روابط في المحتوى',
      weight: 10,
    });
    suggestions.push('أضف روابط داخلية وخارجية لتحسين السيو');
  }

  // 8. Images with Alt Text (10%)
  const images = extractImages(content);
  if (images.length > 0) {
    const imagesWithAlt = images.filter(img => img.alt && img.alt.length > 0);
    if (imagesWithAlt.length === images.length) {
      checks.push({
        name: 'الصور',
        status: 'success',
        message: `جميع الصور (${images.length}) تحتوي على نص بديل`,
        weight: 10,
      });
    } else {
      checks.push({
        name: 'الصور',
        status: 'warning',
        message: `${images.length - imagesWithAlt.length} صورة بدون نص بديل`,
        weight: 10,
      });
      suggestions.push('أضف نصاً بديلاً (alt text) لجميع الصور');
    }
  } else {
    checks.push({
      name: 'الصور',
      status: 'warning',
      message: 'لا توجد صور في المحتوى',
      weight: 10,
    });
    suggestions.push('أضف صوراً توضيحية لتحسين تجربة القارئ');
  }

  // 9. Readability (10%)
  const avgSentenceLength = calculateAvgSentenceLength(content);
  if (avgSentenceLength <= 20) {
    checks.push({
      name: 'سهولة القراءة',
      status: 'success',
      message: 'النص سهل القراءة',
      weight: 10,
    });
  } else if (avgSentenceLength <= 25) {
    checks.push({
      name: 'سهولة القراءة',
      status: 'warning',
      message: 'بعض الجمل طويلة',
      weight: 10,
    });
    suggestions.push('قسّم الجمل الطويلة إلى جمل أقصر (20 كلمة أو أقل)');
  } else {
    checks.push({
      name: 'سهولة القراءة',
      status: 'error',
      message: 'النص صعب القراءة',
      weight: 10,
    });
    suggestions.push('استخدم جملاً أقصر وأبسط لتحسين سهولة القراءة');
  }

  // 10. URL Structure (10%)
  if (slug) {
    const slugLength = slug.length;
    const slugWords = slug.split('-').length;
    if (slugLength <= 60 && slugWords >= 3 && slugWords <= 6) {
      checks.push({
        name: 'بنية الرابط',
        status: 'success',
        message: 'رابط مناسب وواضح',
        weight: 10,
      });
    } else {
      checks.push({
        name: 'بنية الرابط',
        status: 'warning',
        message: 'يمكن تحسين بنية الرابط',
        weight: 10,
      });
      if (slugLength > 60) {
        suggestions.push('اختصر رابط المقالة (slug) ليكون أقل من 60 حرف');
      }
      if (slugWords < 3) {
        suggestions.push('استخدم 3-6 كلمات في رابط المقالة');
      }
    }
  }

  // Calculate total score
  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earnedScore = checks.reduce((sum, check) => {
    if (check.status === 'success') return sum + check.weight;
    if (check.status === 'warning') return sum + check.weight * 0.5;
    return sum;
  }, 0);

  const score = Math.round((earnedScore / totalWeight) * 100);

  return {
    score,
    checks,
    suggestions,
  };
}

// Helper functions
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function extractHeadings(content: string): string[] {
  const headingRegex = /^#{1,6}\s+.+$/gm;
  return content.match(headingRegex) || [];
}

function calculateKeywordDensity(content: string, keyword: string): number {
  const words = countWords(content);
  const keywordRegex = new RegExp(keyword.replace(/\s+/g, '\\s+'), 'gi');
  const matches = content.match(keywordRegex);
  const keywordCount = matches ? matches.length : 0;
  return (keywordCount / words) * 100;
}

function extractLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[2]);
  }
  return links;
}

function extractImages(content: string): Array<{ src: string; alt: string }> {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: Array<{ src: string; alt: string }> = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({ alt: match[1], src: match[2] });
  }
  return images;
}

function calculateAvgSentenceLength(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce((sum, sentence) => sum + countWords(sentence), 0);
  return totalWords / sentences.length;
}

export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
}
