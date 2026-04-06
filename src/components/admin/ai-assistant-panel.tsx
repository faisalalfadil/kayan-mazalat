'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Sparkles, FileText, Lightbulb, CheckCircle2, Wand2 } from 'lucide-react'
import {
  generateTitles,
  generateOutline,
  generateIntroduction,
  generateConclusion,
  generateMetaDescription,
  improveContent,
  suggestKeywords,
  expandSection,
} from '@/lib/ai-writer'
import { toast } from 'sonner'

interface AIAssistantPanelProps {
  keyword?: string
  title?: string
  content?: string
  onInsertContent: (content: string) => void
  onSetTitle?: (title: string) => void
  onSetMetaDescription?: (description: string) => void
}

export function AIAssistantPanel({
  keyword,
  title,
  content,
  onInsertContent,
  onSetTitle,
  onSetMetaDescription,
}: AIAssistantPanelProps) {
  const [loading, setLoading] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
  const [contentBrief, setContentBrief] = useState('')
  const [sectionTitle, setSectionTitle] = useState('')
  const [selectedText, setSelectedText] = useState('')

  const handleGenerateTitles = async () => {
    if (!keyword) {
      toast.error('الرجاء إدخال الكلمة المفتاحية أولاً')
      return
    }

    setLoading(true)
    try {
      const titles = await generateTitles(keyword, contentBrief)
      setGeneratedTitles(titles)
      toast.success('تم توليد العناوين بنجاح')
    } catch (error) {
      toast.error('فشل في توليد العناوين')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateOutline = async () => {
    if (!keyword) {
      toast.error('الرجاء إدخال الكلمة المفتاحية أولاً')
      return
    }

    setLoading(true)
    try {
      const outline = await generateOutline(keyword, contentBrief)
      onInsertContent(outline)
      toast.success('تم توليد المخطط بنجاح')
    } catch (error) {
      toast.error('فشل في توليد المخطط')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateIntroduction = async () => {
    if (!keyword || !title) {
      toast.error('الرجاء إدخال العنوان والكلمة المفتاحية أولاً')
      return
    }

    setLoading(true)
    try {
      const intro = await generateIntroduction(title, keyword)
      onInsertContent(intro)
      toast.success('تم توليد المقدمة بنجاح')
    } catch (error) {
      toast.error('فشل في توليد المقدمة')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateConclusion = async () => {
    if (!keyword || !title) {
      toast.error('الرجاء إدخال العنوان والكلمة المفتاحية أولاً')
      return
    }

    setLoading(true)
    try {
      const conclusion = await generateConclusion(title, keyword)
      onInsertContent(conclusion)
      toast.success('تم توليد الخاتمة بنجاح')
    } catch (error) {
      toast.error('فشل في توليد الخاتمة')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMetaDescription = async () => {
    if (!keyword || !title) {
      toast.error('الرجاء إدخال العنوان والكلمة المفتاحية أولاً')
      return
    }

    setLoading(true)
    try {
      const description = await generateMetaDescription(title, keyword, content?.substring(0, 500))
      if (onSetMetaDescription) {
        onSetMetaDescription(description)
        toast.success('تم توليد الوصف التعريفي بنجاح')
      }
    } catch (error) {
      toast.error('فشل في توليد الوصف التعريفي')
    } finally {
      setLoading(false)
    }
  }

  const handleExpandSection = async () => {
    if (!keyword || !sectionTitle) {
      toast.error('الرجاء إدخال عنوان القسم والكلمة المفتاحية')
      return
    }

    setLoading(true)
    try {
      const expandedContent = await expandSection(sectionTitle, keyword, content)
      onInsertContent(expandedContent)
      toast.success('تم توليد المحتوى بنجاح')
      setSectionTitle('')
    } catch (error) {
      toast.error('فشل في توليد المحتوى')
    } finally {
      setLoading(false)
    }
  }

  const handleImproveContent = async (type: 'clarity' | 'readability' | 'seo' | 'grammar') => {
    const textToImprove = selectedText || content
    if (!textToImprove) {
      toast.error('الرجاء تحديد نص أو كتابة محتوى أولاً')
      return
    }

    setLoading(true)
    try {
      const improved = await improveContent(textToImprove, type, keyword)
      onInsertContent(improved)
      toast.success('تم تحسين المحتوى بنجاح')
    } catch (error) {
      toast.error('فشل في تحسين المحتوى')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestKeywords = async () => {
    if (!keyword) {
      toast.error('الرجاء إدخال الكلمة المفتاحية أولاً')
      return
    }

    setLoading(true)
    try {
      const keywords = await suggestKeywords(keyword)
      setGeneratedKeywords(keywords)
      toast.success('تم اقتراح الكلمات المفتاحية بنجاح')
    } catch (error) {
      toast.error('فشل في اقتراح الكلمات المفتاحية')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          مساعد الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">توليد</TabsTrigger>
            <TabsTrigger value="improve">تحسين</TabsTrigger>
            <TabsTrigger value="keywords">كلمات مفتاحية</TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-4">
            {/* Content Brief */}
            <div className="space-y-2">
              <Label>موجز المحتوى (اختياري)</Label>
              <Textarea
                placeholder="اكتب وصفاً مختصراً لموضوع المقالة..."
                value={contentBrief}
                onChange={(e) => setContentBrief(e.target.value)}
                rows={3}
              />
            </div>

            {/* Generate Titles */}
            <div className="space-y-2">
              <Button
                onClick={handleGenerateTitles}
                disabled={loading || !keyword}
                className="w-full"
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 ml-2" />
                )}
                توليد عناوين مقترحة
              </Button>

              {generatedTitles.length > 0 && (
                <div className="space-y-2 mt-3">
                  <Label className="text-sm text-slate-600">اختر عنواناً:</Label>
                  {generatedTitles.map((t, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2"
                      onClick={() => {
                        if (onSetTitle) {
                          onSetTitle(t)
                          toast.success('تم تعيين العنوان')
                        }
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generate Outline */}
            <Button
              onClick={handleGenerateOutline}
              disabled={loading || !keyword}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 ml-2" />
              )}
              توليد مخطط المقالة
            </Button>

            {/* Generate Introduction */}
            <Button
              onClick={handleGenerateIntroduction}
              disabled={loading || !keyword || !title}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 ml-2" />
              )}
              توليد المقدمة
            </Button>

            {/* Generate Conclusion */}
            <Button
              onClick={handleGenerateConclusion}
              disabled={loading || !keyword || !title}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 ml-2" />
              )}
              توليد الخاتمة
            </Button>

            {/* Expand Section */}
            <div className="space-y-2">
              <Label>توسيع قسم معين</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="عنوان القسم..."
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button
                  onClick={handleExpandSection}
                  disabled={loading || !keyword || !sectionTitle}
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Generate Meta Description */}
            <Button
              onClick={handleGenerateMetaDescription}
              disabled={loading || !keyword || !title}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 ml-2" />
              )}
              توليد الوصف التعريفي
            </Button>
          </TabsContent>

          {/* Improve Tab */}
          <TabsContent value="improve" className="space-y-4">
            <div className="space-y-2">
              <Label>نص للتحسين (اختياري - سيتم استخدام المحتوى الكامل إذا كان فارغاً)</Label>
              <Textarea
                placeholder="الصق النص الذي تريد تحسينه..."
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleImproveContent('clarity')}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Wand2 className="h-4 w-4 ml-2" />}
                تحسين الوضوح
              </Button>

              <Button
                onClick={() => handleImproveContent('readability')}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Wand2 className="h-4 w-4 ml-2" />}
                تحسين القراءة
              </Button>

              <Button
                onClick={() => handleImproveContent('seo')}
                disabled={loading || !keyword}
                variant="outline"
                size="sm"
              >
                {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Wand2 className="h-4 w-4 ml-2" />}
                تحسين السيو
              </Button>

              <Button
                onClick={() => handleImproveContent('grammar')}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Wand2 className="h-4 w-4 ml-2" />}
                تصحيح النحو
              </Button>
            </div>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-4">
            <Button
              onClick={handleSuggestKeywords}
              disabled={loading || !keyword}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 ml-2" />
              )}
              اقتراح كلمات مفتاحية ذات صلة
            </Button>

            {generatedKeywords.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-slate-600">كلمات مفتاحية مقترحة:</Label>
                <div className="flex flex-wrap gap-2">
                  {generatedKeywords.map((kw, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm cursor-pointer hover:bg-purple-200 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(kw)
                        toast.success('تم نسخ الكلمة المفتاحية')
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info */}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg text-xs text-slate-600">
          <p className="font-semibold mb-1">💡 نصيحة:</p>
          <p>استخدم مساعد الذكاء الاصطناعي لتسريع عملية الكتابة، لكن تأكد من مراجعة وتعديل المحتوى المولد ليناسب أسلوبك وجمهورك.</p>
        </div>
      </CardContent>
    </Card>
  )
}
