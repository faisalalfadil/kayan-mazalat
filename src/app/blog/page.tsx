import { Metadata } from 'next'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, User, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export const metadata: Metadata = {
  title: 'المدونة - كيان مزلات',
  description: 'اقرأ أحدث المقالات والأخبار حول الألواح الساندويتش والبناء الحديث',
  openGraph: {
    title: 'المدونة - كيان مزلات',
    description: 'اقرأ أحدث المقالات والأخبار حول الألواح الساندويتش والبناء الحديث',
    type: 'website',
  },
}

interface SearchParams {
  page?: string
  category?: string
  search?: string
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit
  const categorySlug = searchParams.category
  const searchQuery = searchParams.search

  // Build where clause
  const where: any = {
    published: true,
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { excerpt: { contains: searchQuery, mode: 'insensitive' } },
      { content: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  // Fetch posts
  const [posts, totalCount, categories] = await Promise.all([
    db.blogPost.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    db.blogPost.count({ where }),
    db.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-orange-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">المدونة</h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            اكتشف أحدث المقالات والنصائح حول الألواح الساندويتش والبناء الحديث
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  البحث
                </h3>
                <form action="/blog" method="get">
                  <div className="flex gap-2">
                    <Input
                      name="search"
                      placeholder="ابحث في المقالات..."
                      defaultValue={searchQuery}
                    />
                    <Button type="submit" size="sm">
                      بحث
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">التصنيفات</h3>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      !categorySlug
                        ? 'bg-orange-100 text-orange-800 font-medium'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>الكل</span>
                      <Badge variant="secondary">{totalCount}</Badge>
                    </div>
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.slug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        categorySlug === category.slug
                          ? 'bg-orange-100 text-orange-800 font-medium'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <Badge variant="secondary">{category._count.posts}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600">
                {searchQuery && `نتائج البحث عن "${searchQuery}" - `}
                {totalCount} مقالة
              </p>
              {(categorySlug || searchQuery) && (
                <Link href="/blog">
                  <Button variant="outline" size="sm">
                    مسح الفلاتر
                  </Button>
                </Link>
              )}
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-500 text-lg">لا توجد مقالات</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                      {/* Image */}
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
                        {/* Category & Reading Time */}
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

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-slate-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.publishedAt &&
                              format(new Date(post.publishedAt), 'dd MMMM yyyy', {
                                locale: ar,
                              })}
                          </span>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag.name}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Link
                  href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                >
                  <Button variant="outline" size="sm" disabled={page <= 1}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
                    >
                      <Button
                        variant={p === page ? 'default' : 'outline'}
                        size="sm"
                        className={p === page ? 'bg-orange-600 hover:bg-orange-700' : ''}
                      >
                        {p}
                      </Button>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                >
                  <Button variant="outline" size="sm" disabled={page >= totalPages}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
