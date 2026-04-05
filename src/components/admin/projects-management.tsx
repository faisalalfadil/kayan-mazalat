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
import { Plus, Pencil, Trash2, RefreshCw, MapPin, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Project {
  id: string
  title: string
  titleEn: string | null
  description: string
  descriptionEn: string | null
  image: string
  images: string | null
  location: string | null
  client: string | null
  completedAt: string | null
  isFeatured: boolean
  isActive: boolean
  createdAt: string
}

const emptyForm = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  image: '',
  images: '',
  location: '',
  client: '',
  completedAt: '',
  isFeatured: false,
  isActive: true,
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id)
    setForm({
      title: project.title,
      titleEn: project.titleEn || '',
      description: project.description,
      descriptionEn: project.descriptionEn || '',
      image: project.image,
      images: project.images || '',
      location: project.location || '',
      client: project.client || '',
      completedAt: project.completedAt ? project.completedAt.split('T')[0] : '',
      isFeatured: project.isFeatured,
      isActive: project.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast({ title: 'خطأ', description: 'العنوان والوصف مطلوبان', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: editingId ? 'تم التحديث' : 'تم الإنشاء',
          description: editingId ? 'تم تحديث المشروع بنجاح' : 'تم إنشاء المشروع بنجاح',
        })
        setDialogOpen(false)
        fetchProjects()
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
      const res = await fetch(`/api/admin/projects/${deletingId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'تم الحذف', description: 'تم تعطيل المشروع بنجاح' })
        setDeleteOpen(false)
        fetchProjects()
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الحذف', variant: 'destructive' })
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.includes(search) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(search.toLowerCase())) ||
      (p.location && p.location.includes(search)) ||
      (p.client && p.client.includes(search))
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
              placeholder="بحث في المشاريع..."
              className="pr-9"
            />
          </div>
          <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مشروع
          </Button>
        </div>
        <Button variant="outline" onClick={fetchProjects}>
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">تاريخ الإنجاز</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">صورة</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        {project.isFeatured && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs mt-1">مميز</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.location ? (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">{project.client || '-'}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {project.completedAt
                      ? new Date(project.completedAt).toLocaleDateString('ar-SA')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={project.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                      {project.isActive ? 'مفعّل' : 'معطّل'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(project)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingId(project.id)
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
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    {search ? 'لا توجد نتائج للبحث' : 'لا توجد مشاريع'}
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
            <DialogTitle>{editingId ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان المشروع (عربي) *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان المشروع"
              />
            </div>
            <div className="space-y-2">
              <Label>عنوان المشروع (إنجليزي)</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="Project title"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف (عربي) *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف المشروع"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>رابط الصورة الرئيسية *</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>روابط الصور الإضافية (مفصولة بفواصل)</Label>
              <Input
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="https://..., https://..."
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الموقع</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="الرياض"
                />
              </div>
              <div className="space-y-2">
                <Label>العميل</Label>
                <Input
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="اسم العميل"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>تاريخ الإنجاز</Label>
              <Input
                type="date"
                value={form.completedAt}
                onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(checked) => setForm({ ...form, isFeatured: checked })}
                />
                <Label>مشروع مميز</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
                <Label>مفعّل</Label>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة المشروع'}
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
              سيتم تعطيل هذا المشروع ولن يظهر في الموقع الإلكتروني.
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
