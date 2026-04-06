import { Metadata } from 'next'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Share2, ChevronRight, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })

  if (!post) {
    return {
      title: 'المقال غير موجود',
    }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || ''
  const image = post.image || '/images/default-blog.jpg'

  return {
    title: `${title} - كيان مزلات`,
    description,
    keywords: post.keywords || undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images: [{ url: image, alt: post.featuredImageAlt || post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      tags: true,
    },
  })

  if (!post || !post.published) {
    notFound()
  }

  // Increment view count
  await db.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  // Get related posts (same category)
  const relatedPosts = await db.blogPost.findMany({
    where: {
      published: true,
      categoryId: post.categoryId,
      NOT: { id: post.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  // Get previous and next posts
  const [previousPost, nextPost] = await Promise.all([
    db.blogPost.findFirst({
      where: {
        published: true,
        publishedAt: { lt: post.publishedAt || post.createdAt },
      },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true },
    }),
    db.blogPost.findFirst({
      where: {
        published: true,
        publishedAt: { gt: post.publishedAt || post.createdAt },
      },
      orderBy: { publishedAt: 'asc' },
      select: { slug: true, title: true },
    }),
  ])

  // Extract headings for table of contents
  const headings = post.content.match(/^#{2,3}\s+.+$/gm) || []
  const toc = headings.map((heading) => {
    const level = heading.match(/^#{2,3}/)?.[0].length || 2
    const text = heading.replace(/^#{2,3}\s+/, '')
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
    return { level, text, id }
  })

  const shareUrl = `https://kayan-mazalat.com/blog/${post.slug}`

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
            {post.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="hover:text-orange-600"
                >
                  {post.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium truncate max-w-xs">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {/* Category */}
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`}>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mb-4">
                  {post.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-6">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {post.publishedAt &&
                  format(new Date(post.publishedAt), 'dd MMMM yyyy', { locale: ar })}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {post.readingTime} دقيقة قراءة
                </span>
              )}
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {post.viewCount} مشاهدة
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                    <Badge variant="outline" className="hover:bg-slate-100">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Featured Image */}
            {post.image && (
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 mb-8">
                <img
                  src={post.image}
                  alt={post.featuredImageAlt || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-3 pb-6 border-b">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                مشاركة:
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                واتساب
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                تويتر
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
              >
                فيسبوك
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm"
              >
                لينكدإن
              </a>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <aside className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">محتويات المقال</h3>
                    <nav className="space-y-2">
                      {toc.map((item, index) => (
                        <a
                          key={index}
                          href={`#${item.id}`}
                          className={`block text-sm hover:text-orange-600 transition-colors ${
                            item.level === 3 ? 'pr-4 text-slate-600' : 'font-medium'
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </aside>
            )}

            {/* Content */}
            <div className={toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md">
                <ReactMarkdown
                  components={{
                    h2: ({ children, ...props }) => {
                      const text = children?.toString() || ''
                      const id = text
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
                      return <h2 id={id} {...props}>{children}</h2>
                    },
                    h3: ({ children, ...props }) => {
                      const text = children?.toString() || ''
                      const id = text
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
                      return <h3 id={id} {...props}>{children}</h3>
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t">
            {previousPost && (
              <Link href={`/blog/${previousPost.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-sm text-slate-600 mb-2">المقال السابق</p>
                    <h3 className="font-semibold hover:text-orange-600 transition-colors">
                      {previousPost.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )}
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-left">
                    <p className="text-sm text-slate-600 mb-2">المقال التالي</p>
                    <h3 className="font-semibold hover:text-orange-600 transition-colors">
                      {nextPost.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      {related.image && (
                        <div className="aspect-video bg-slate-200 overflow-hidden">
                          <img
                            src={related.image}
                            alt={related.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
                          {related.title}
                        </h3>
                        {related.excerpt && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {related.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || post.metaDescription,
            image: post.image,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'كيان مزلات',
              logo: {
                '@type': 'ImageObject',
                url: 'https://kayan-mazalat.com/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': shareUrl,
            },
          }),
        }}
      />
    </div>
  )
}
