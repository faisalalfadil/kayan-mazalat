'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
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
  author: 'كيان القمة',
  published: false,
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
      <div className="flex items-center justify-between">
        <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مقال
        </Button>
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
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">المؤلف</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{post.author}</TableCell>
                  <TableCell>
                    <Badge className={post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {post.published ? 'منشور' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(post)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingId(post.id)
                          setDeleteOpen(true)
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    لا توجد مقالات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                placeholder="محتوى المقال الكامل"
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>رابط الصورة</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
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
              className="w-full bg-blue-600 hover:bg-blue-700"
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
    </div>
  )
}
