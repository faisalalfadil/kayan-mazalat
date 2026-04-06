import { Metadata } from 'next'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await db.tag.findUnique({
    where: { slug: params.slug },
  })

  if (!tag) {
    return {
      title: 'الوسم غير موجود',
    }
  }

  return {
    title: `${tag.name} - كيان مزلات`,
    description: `تصفح جميع المقالات الموسومة بـ ${tag.name}`,
    openGraph: {
      title: `${tag.name} - كيان مزلات`,
      description: `تصفح جميع المقالات الموسومة بـ ${tag.name}`,
      type: 'website',
    },
  }
}

export default async function TagPage({ params }: Props) {
  const tag = await db.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { published: true },
        include: {
          category: true,
          tags: true,
        },
        orderBy: { publishedAt: 'desc' },
      },
    },
  })

  if (!tag) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-orange-600">
              الرئيسية
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-orange-600">
              المدونة
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">#{tag.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-l from-blue-600 to-blue-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">#</span>
            <h1 className="text-4xl md:text-5xl font-bold">{tag.name}</h1>
          </div>
          <p className="text-blue-100 text-lg">{tag.posts.length} مقالة</p>
        </div>
      </section>

      {/* Posts */}
      <div className="container mx-auto px-4 py-12">
        {tag.posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 text-lg">لا توجد مقالات بهذا الوسم</p>
              <Link href="/blog" className="mt-4 inline-block">
                <Badge className="bg-orange-600 hover:bg-orange-700">
                  العودة إلى المدونة
                </Badge>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tag.posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                  {post.image && (
                    <div className="aspect-video bg-slate-200 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.featuredImageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      {post.category && (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          {post.category.name}
                        </Badge>
                      )}
                      {post.readingTime && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readingTime} دقيقة
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishedAt &&
                          format(new Date(post.publishedAt), 'dd MMM yyyy', {
                            locale: ar,
                          })}
                      </span>
                    </div>

                    {post.tags && post.tags.length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags
                          .filter((t) => t.id !== tag.id)
                          .slice(0, 3)
                          .map((t) => (
                            <Badge key={t.id} variant="outline" className="text-xs">
                              {t.name}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
