'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Monitor, Twitter, Facebook } from 'lucide-react'

interface MetaPreviewProps {
  title: string
  metaTitle?: string
  metaDescription?: string
  slug?: string
  image?: string
  author?: string
}

export function MetaPreview({
  title,
  metaTitle,
  metaDescription,
  slug,
  image,
  author = 'كيان القمة',
}: MetaPreviewProps) {
  const displayTitle = metaTitle || title
  const displayDescription = metaDescription || 'اقرأ المزيد على موقعنا'
  const displayUrl = `https://kayan-mazalat.com/blog/${slug || 'article'}`
  const displayImage = image || '/images/default-blog.svg'

  return (
    <Card>
      <CardHeader>
        <CardTitle>معاينة في محركات البحث ووسائل التواصل</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Google
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </TabsTrigger>
          </TabsList>

          {/* Google Preview */}
          <TabsContent value="google" className="mt-4">
            <div className="border rounded-lg p-4 bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                    K
                  </div>
                  <span className="text-slate-600">kayan-mazalat.com</span>
                </div>
                <div className="text-blue-600 hover:underline cursor-pointer text-xl font-normal leading-tight">
                  {displayTitle.length > 60 ? displayTitle.substring(0, 60) + '...' : displayTitle}
                </div>
                <div className="text-sm text-slate-600">
                  {displayUrl.length > 60 ? displayUrl.substring(0, 60) + '...' : displayUrl}
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {displayDescription.length > 160
                    ? displayDescription.substring(0, 160) + '...'
                    : displayDescription}
                </div>
              </div>
              {displayTitle.length > 60 && (
                <p className="text-xs text-red-600 mt-2">⚠️ العنوان طويل جداً (سيتم قصه)</p>
              )}
              {displayDescription.length > 160 && (
                <p className="text-xs text-red-600 mt-1">⚠️ الوصف طويل جداً (سيتم قصه)</p>
              )}
            </div>
          </TabsContent>

          {/* Twitter Preview */}
          <TabsContent value="twitter" className="mt-4">
            <div className="border rounded-lg overflow-hidden bg-white">
              {displayImage && (
                <div className="w-full h-48 bg-slate-200 relative">
                  <img
                    src={displayImage}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-blog.jpg'
                    }}
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="text-slate-500 text-xs uppercase">
                  {new URL(displayUrl).hostname}
                </div>
                <div className="font-semibold text-base leading-tight">
                  {displayTitle.length > 70 ? displayTitle.substring(0, 70) + '...' : displayTitle}
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {displayDescription.length > 200
                    ? displayDescription.substring(0, 200) + '...'
                    : displayDescription}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Facebook Preview */}
          <TabsContent value="facebook" className="mt-4">
            <div className="border rounded-lg overflow-hidden bg-white">
              {displayImage && (
                <div className="w-full h-64 bg-slate-200 relative">
                  <img
                    src={displayImage}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-blog.jpg'
                    }}
                  />
                </div>
              )}
              <div className="p-3 bg-slate-50 border-t space-y-1">
                <div className="text-xs text-slate-500 uppercase">
                  {new URL(displayUrl).hostname}
                </div>
                <div className="font-semibold text-base leading-tight text-slate-900">
                  {displayTitle.length > 80 ? displayTitle.substring(0, 80) + '...' : displayTitle}
                </div>
                <div className="text-sm text-slate-600">
                  {displayDescription.length > 300
                    ? displayDescription.substring(0, 300) + '...'
                    : displayDescription}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-slate-700">
          <p className="font-semibold mb-2">💡 نصائح:</p>
          <ul className="space-y-1 text-xs">
            <li>• العنوان المثالي: 50-60 حرف</li>
            <li>• الوصف المثالي: 150-160 حرف</li>
            <li>• استخدم صورة بجودة عالية (1200x630 بكسل للمشاركة على وسائل التواصل)</li>
            <li>• تأكد من أن العنوان والوصف جذابين ويشجعان على النقر</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
