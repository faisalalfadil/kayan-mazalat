'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogTrigger,
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
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Service {
  id: string
  title: string
  titleEn: string | null
  description: string
  descriptionEn: string | null
  icon: string
  image: string | null
  order: number
  isActive: boolean
}

const emptyForm = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  icon: '',
  image: '',
  order: 0,
  isActive: true,
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const handleOpenEdit = (service: Service) => {
    setEditingId(service.id)
    setForm({
      title: service.title,
      titleEn: service.titleEn || '',
      description: service.description,
      descriptionEn: service.descriptionEn || '',
      icon: service.icon,
      image: service.image || '',
      order: service.order,
      isActive: service.isActive,
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
      const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: editingId ? 'تم التحديث' : 'تم الإنشاء',
          description: editingId ? 'تم تحديث الخدمة بنجاح' : 'تم إنشاء الخدمة بنجاح',
        })
        setDialogOpen(false)
        fetchServices()
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
      const res = await fetch(`/api/admin/services/${deletingId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'تم الحذف', description: 'تم تعطيل الخدمة بنجاح' })
        setDeleteOpen(false)
        fetchServices()
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الحذف', variant: 'destructive' })
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      })
      if (res.ok) {
        toast({
          title: 'تم التحديث',
          description: service.isActive ? 'تم تعطيل الخدمة' : 'تم تفعيل الخدمة',
        })
        fetchServices()
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const filteredServices = services.filter(
    (s) =>
      s.title.includes(search) ||
      (s.titleEn && s.titleEn.toLowerCase().includes(search.toLowerCase()))
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
              placeholder="بحث في الخدمات..."
              className="pr-9"
            />
          </div>
          <Button onClick={handleOpenAdd} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 ml-2" />
            إضافة خدمة
          </Button>
        </div>
        <Button variant="outline" onClick={fetchServices}>
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الأيقونة</TableHead>
                <TableHead className="text-right">الترتيب</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service, idx) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.title}</p>
                      {service.titleEn && (
                        <p className="text-xs text-gray-400" dir="ltr">{service.titleEn}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm" dir="ltr">{service.icon}</TableCell>
                  <TableCell>{service.order}</TableCell>
                  <TableCell>
                    <Badge className={service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                      {service.isActive ? 'مفعّل' : 'معطّل'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={() => handleToggleActive(service)}
                        className="scale-75"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(service)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingId(service.id)
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
              {filteredServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    {search ? 'لا توجد نتائج للبحث' : 'لا توجد خدمات'}
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
            <DialogTitle>{editingId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>العنوان (عربي) *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان الخدمة"
              />
            </div>
            <div className="space-y-2">
              <Label>العنوان (إنجليزي)</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="Service title"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف (عربي) *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف الخدمة"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف (إنجليزي)</Label>
              <Textarea
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                placeholder="Service description"
                rows={3}
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الأيقونة (Lucide)</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="Shield"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>ترتيب العرض</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  dir="ltr"
                />
              </div>
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
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
              />
              <Label>خدمة مفعّلة</Label>
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة الخدمة'}
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
              سيتم تعطيل هذه الخدمة ولن تظهر في الموقع الإلكتروني.
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
