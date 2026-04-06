'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, RefreshCw, Search, FileText, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { RichTextEditor } from './rich-text-editor'
import { SEOPanel } from './seo-panel'
import { MetaPreview } from './meta-preview'
import { AIAssistantPanel } from './ai-assistant-panel'
import { analyzeSEO, calculateReadingTime } from '@/lib/seo-analyzer'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  author: string
  published: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  focusKeyword?: string | null
  keywords?: string | null
  readingTime?: number | null
  wordCount?: number | null
  seoScore?: number | null
  featuredImageAlt?: string | null
  categoryId?: string | null
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  author: 'كيان القمة',
  published: false,
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  keywords: '',
  featuredImageAlt: '',
  categoryId: '',
  tagIds: [] as string[],
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setCategories(data.categories)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tags')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setTags(data.tags)
        }
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchTags()
  }, [fetchPosts, fetchCategories, fetchTags])

  // Analyze SEO whenever relevant fields change
  useEffect(() => {
    if (form.title || form.content) {
      const analysis = analyzeSEO(
        form.title,
        form.content,
        form.metaTitle,
        form.metaDescription,
        form.focusKeyword,
        generateSlug(form.title)
      )
      setSeoAnalysis(analysis)
    }
  }, [form.title, form.content, form.metaTitle, form.metaDescription, form.focusKeyword])

  const generateSlug = (title: string) => {
    const timestamp = Date.now().toString(36)
    return `${title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')}-${timestamp}`
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('files', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const data = await res.json()
      return data.urls?.[0] || ''
    }
    throw new Error('فشل رفع الصورة')
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSeoAnalysis(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id)
    setForm({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      image: post.image || '',
      author: post.author,
      published: post.published,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      focusKeyword: post.focusKeyword || '',
      keywords: post.keywords || '',
      featuredImageAlt: post.featuredImageAlt || '',
      categoryId: post.categoryId || '',
      tagIds: [],
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error('العنوان والمحتوى مطلوبان')
      return
    }

    setSaving(true)
    try {
      // Calculate word count and reading time
      const wordCount = form.content.trim().split(/\s+/).length
      const readingTime = calculateReadingTime(wordCount)

      const payload = {
        ...form,
        wordCount,
        readingTime,
        seoScore: seoAnalysis?.score || 0,
      }

      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingId ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح')
        setDialogOpen(false)
        fetchPosts()
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ')
      }
    } catch {
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف المقال بنجاح')
        fetchPosts()
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    }
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.includes(search) ||
      (p.author && p.author.includes(search)) ||
      (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في المقالات..."
              className="pr-9"
            />
          </div>
          <Button onClick={handleOpenAdd} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مقال
          </Button>
        </div>
        <Button variant="outline" onClick={fetchPosts}>
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المقال</TableHead>
                <TableHead className="text-right">المؤلف</TableHead>
                <TableHead className="text-right">درجة السيو</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {post.seoScore !== null && post.seoScore !== undefined ? (
                      <Badge
                        className={
                          post.seoScore >= 80
                            ? 'bg-green-100 text-green-800'
                            : post.seoScore >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {post.seoScore}/100
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'منشور' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(post)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" dir="rtl">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">المحتوى</TabsTrigger>
              <TabsTrigger value="seo">السيو</TabsTrigger>
              <TabsTrigger value="ai">مساعد AI</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="عنوان المقال..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">المقتطف</Label>
                <Input
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="ملخص قصير للمقال..."
                />
              </div>

              <div className="space-y-2">
                <Label>المحتوى *</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => setForm({ ...form, content })}
                  onImageUpload={handleImageUpload}
                  placeholder="ابدأ الكتابة..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image">رابط الصورة الرئيسية</Label>
                  <Input
                    id="image"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageAlt">النص البديل للصورة</Label>
                  <Input
                    id="imageAlt"
                    value={form.featuredImageAlt}
                    onChange={(e) => setForm({ ...form, featuredImageAlt: e.target.value })}
                    placeholder="وصف الصورة..."
                  />
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="focusKeyword">الكلمة المفتاحية الرئيسية</Label>
                    <Input
                      id="focusKeyword"
                      value={form.focusKeyword}
                      onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                      placeholder="الكلمة المفتاحية..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">عنوان Meta (50-60 حرف)</Label>
                    <Input
                      id="metaTitle"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      placeholder="عنوان مخصص لمحركات البحث..."
                      maxLength={60}
                    />
                    <p className="text-xs text-slate-500">
                      {form.metaTitle.length}/60 حرف
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">وصف Meta (150-160 حرف)</Label>
                    <Input
                      id="metaDescription"
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      placeholder="وصف مخصص لمحركات البحث..."
                      maxLength={160}
                    />
                    <p className="text-xs text-slate-500">
                      {form.metaDescription.length}/160 حرف
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">كلمات مفتاحية إضافية</Label>
                    <Input
                      id="keywords"
                      value={form.keywords}
                      onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                      placeholder="كلمة1, كلمة2, كلمة3..."
                    />
                  </div>

                  {seoAnalysis && <SEOPanel analysis={seoAnalysis} />}
                </div>

                <div>
                  <MetaPreview
                    title={form.title}
                    metaTitle={form.metaTitle}
                    metaDescription={form.metaDescription}
                    slug={generateSlug(form.title)}
                    image={form.image}
                    author={form.author}
                  />
                </div>
              </div>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="space-y-4">
              <AIAssistantPanel
                keyword={form.focusKeyword}
                title={form.title}
                content={form.content}
                onInsertContent={(content) => setForm({ ...form, content: form.content + '\n\n' + content })}
                onSetTitle={(title) => setForm({ ...form, title })}
                onSetMetaDescription={(metaDescription) => setForm({ ...form, metaDescription })}
              />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author">المؤلف</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => setForm({ ...form, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيفاً..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="published">نشر المقال</Label>
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editingId ? 'تحديث' : 'إنشاء'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
