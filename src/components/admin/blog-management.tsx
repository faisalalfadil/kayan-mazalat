'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, RefreshCw, Search, Upload, X, ImageIcon, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  images: string | null
  author: string
  published: boolean
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  images: '',
  author: 'كيان القمة',
  published: false,
}

function parseImages(images: string | null | undefined): string[] {
  if (!images) return []
  return images.split(',').map(url => url.trim()).filter(url => url.length > 0)
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const mainFileRef = useRef<HTMLInputElement>(null)
  const multiFileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Upload main image
  const handleMainImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('files', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        if (data.urls?.[0]) {
          setForm(prev => ({ ...prev, image: data.urls[0] }))
          toast({ title: 'تم رفع الصورة', description: 'تم رفع الصورة الرئيسية بنجاح' })
        }
      } else {
        const err = await res.json()
        toast({ title: 'خطأ', description: err.error || 'فشل رفع الصورة', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في رفع الصورة', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  // Upload gallery images
  const handleGalleryUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(f => formData.append('files', f))
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        if (data.urls?.length) {
          const current = form.images ? form.images.split(',').filter(u => u.trim()) : []
          setForm(prev => ({ ...prev, images: [...current, ...data.urls].join(', ') }))
          toast({ title: 'تم رفع الصور', description: `تم رفع ${data.urls.length} صورة بنجاح` })
        }
      } else {
        const err = await res.json()
        toast({ title: 'خطأ', description: err.error || 'فشل رفع الصور', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في رفع الصور', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    const imgs = form.images ? form.images.split(',').filter(u => u.trim()) : []
    imgs.splice(index, 1)
    setForm(prev => ({ ...prev, images: imgs.join(', ') }))
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id)
    setForm({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      image: post.image || '',
      images: post.images || '',
      author: post.author,
      published: post.published,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({ title: 'خطأ', description: 'العنوان والمحتوى مطلوبان', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({
          title: editingId ? 'تم التحديث' : 'تم الإنشاء',
          description: editingId ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح',
        })
        setDialogOpen(false)
        fetchPosts()
      } else {
        const data = await res.json()
        toast({ title: 'خطأ', description: data.error || 'حدث خطأ', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/blog/${deletingId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'تم الحذف', description: 'تم حذف المقال بنجاح' })
        setDeleteOpen(false)
        fetchPosts()
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الحذف', variant: 'destructive' })
    }
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.includes(search) ||
      (p.author && p.author.includes(search)) ||
      (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()))
  )

  const getFormGalleryImages = () => parseImages(form.images)

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
                <TableHead className="text-right">الصور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => {
                const imgs = parseImages(post.images)
                const totalImages = [post.image, ...imgs].filter(Boolean)
                return (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-orange-300 transition-all"
                          onClick={() => {
                            if (totalImages.length > 0) {
                              setLightboxImages(totalImages)
                              setLightboxIndex(0)
                              setLightboxOpen(true)
                            }
                          }}
                        >
                          {post.image ? (
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">صورة</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{post.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{post.author}</TableCell>
                    <TableCell>
                      {totalImages.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-2 rtl:space-x-reverse">
                            {totalImages.slice(0, 3).map((img, idx) => (
                              <div
                                key={idx}
                                className="w-7 h-7 rounded-md border-2 border-white overflow-hidden cursor-pointer hover:z-10"
                                onClick={() => {
                                  setLightboxImages(totalImages)
                                  setLightboxIndex(idx)
                                  setLightboxOpen(true)
                                }}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {totalImages.length > 3 && (
                              <div className="w-7 h-7 rounded-md border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                +{totalImages.length - 3}
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs mr-1">
                            <ImageIcon className="w-3 h-3 ml-1" />
                            {totalImages.length}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {post.published ? 'منشور' : 'مسودة'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {totalImages.length > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setLightboxImages(totalImages)
                              setLightboxIndex(0)
                              setLightboxOpen(true)
                            }}
                            title="معاينة الصور"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(post)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setDeletingId(post.id); setDeleteOpen(true) }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    {search ? 'لا توجد نتائج للبحث' : 'لا توجد مقالات'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان المقال *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان المقال"
              />
            </div>
            {!editingId && (
              <p className="text-xs text-gray-400">سيتم إنشاء الرابط تلقائياً من العنوان</p>
            )}
            <div className="space-y-2">
              <Label>المقتطف</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="مقتطف قصير من المقال"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>المحتوى *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="محتوى المقال الكامل - يمكنك استخدام ## للعناوين و - للنقاط"
                rows={8}
              />
            </div>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>الصورة الرئيسية</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={mainFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleMainImageUpload(e.target.files[0])
                      e.target.value = ''
                    }
                  }}
                />
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="رابط الصورة أو اضغط رفع"
                  dir="ltr"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => mainFileRef.current?.click()}
                  disabled={uploading}
                  className="gap-1 shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'جاري...' : 'رفع'}
                </Button>
              </div>
              {form.image && (
                <div className="relative w-32 h-24 rounded-lg overflow-hidden border">
                  <img src={form.image} alt="معاينة" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <Label>صور إضافية داخل المقال</Label>
              <input
                ref={multiFileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleGalleryUpload(e.target.files)
                    e.target.value = ''
                  }
                }}
              />
              <div
                className={`
                  border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer
                  ${dragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}
                `}
                onClick={() => multiFileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  if (e.dataTransfer.files?.length) handleGalleryUpload(e.dataTransfer.files)
                }}
              >
                <Upload className={`w-7 h-7 mx-auto mb-2 ${uploading ? 'animate-bounce text-orange-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600">
                  {uploading ? 'جاري رفع الصور...' : 'اسحب الصور هنا أو اضغط للاختيار'}
                </p>
                <p className="text-xs text-gray-400 mt-1">يمكنك رفع عدة صور (JPEG, PNG, WebP) بحد أقصى 5MB لكل صورة</p>
              </div>

              {/* Gallery preview */}
              {getFormGalleryImages().length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">الصور المرفوعة ({getFormGalleryImages().length}):</p>
                  <div className="grid grid-cols-4 gap-2">
                    {getFormGalleryImages().map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                        <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-0.5">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">أو أدخل الروابط يدوياً</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <Input
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="رابط1, رابط2, رابط3 (مفصولة بفواصل)"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>المؤلف</Label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="كيان القمة"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.published}
                onCheckedChange={(checked) => setForm({ ...form, published: checked })}
              />
              <Label>نشر المقال</Label>
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة المقال'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا المقال نهائياً ولا يمكن استرجاعه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lightbox */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          {lightboxImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(p => p > 0 ? p - 1 : lightboxImages.length - 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(p => p < lightboxImages.length - 1 ? p + 1 : 0) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            </>
          )}
          <img
            src={lightboxImages[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
