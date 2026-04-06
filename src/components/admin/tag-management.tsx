'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2, Plus, Pencil, Trash2, Tag as TagIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Tag {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

export function TagManagement() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags')
      const data = await response.json()
      if (data.success) {
        setTags(data.tags)
      }
    } catch (error) {
      toast.error('فشل في جلب الوسوم')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingTag
        ? `/api/admin/tags/${editingTag.id}`
        : '/api/admin/tags'
      const method = editingTag ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingTag ? 'تم تحديث الوسم' : 'تم إنشاء الوسم')
        setDialogOpen(false)
        resetForm()
        fetchTags()
      } else {
        toast.error(data.error || 'حدث خطأ')
      }
    } catch (error) {
      toast.error('فشل في حفظ الوسم')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      slug: tag.slug,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`هل أنت متأكد من حذف الوسم "${tag.name}"؟`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tags/${tag.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('تم حذف الوسم')
        fetchTags()
      } else {
        toast.error(data.error || 'فشل في حذف الوسم')
      }
    } catch (error) {
      toast.error('فشل في حذف الوسم')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
    })
    setEditingTag(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="h-5 w-5" />
              إدارة الوسوم
            </CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة وسم
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              لا توجد وسوم. ابدأ بإضافة وسم جديد.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tag Cloud Visualization */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-slate-700">سحابة الوسوم</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const count = tag._count?.posts || 0
                    const size = count === 0 ? 'text-sm' : count < 5 ? 'text-base' : count < 10 ? 'text-lg' : 'text-xl'
                    return (
                      <span
                        key={tag.id}
                        className={`px-3 py-1 bg-blue-100 text-blue-800 rounded-full ${size} font-medium cursor-pointer hover:bg-blue-200 transition-colors`}
                        onClick={() => handleEdit(tag)}
                      >
                        {tag.name} ({count})
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Tags Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الرابط</TableHead>
                    <TableHead className="text-center">عدد المقالات</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {tag.slug}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          {tag._count?.posts || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tag)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tag)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'تعديل الوسم' : 'إضافة وسم جديد'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: برمجة، تصميم، تسويق"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">الرابط (Slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="programming"
                required
                dir="ltr"
              />
              <p className="text-xs text-slate-500">
                سيتم توليده تلقائياً من الاسم
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={submitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                {editingTag ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
