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
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Plus, Pencil, Trash2, RefreshCw, Search, FileText, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ServiceContent {
  id: string
  serviceId: string
  heroTagline: string
  overview: string
  stats: string
  features: string
  advantages: string
  faqs: string
}

interface Service {
  id: string
  title: string
  titleEn: string | null
  slug: string | null
  description: string
  descriptionEn: string | null
  icon: string
  image: string | null
  order: number
  isActive: boolean
  content: ServiceContent | null
}

const ICON_OPTIONS = [
  'Sun', 'Layers', 'Paintbrush', 'TreePine', 'Diamond', 'SquareStack',
  'LayoutGrid', 'Wallpaper', 'Sparkles', 'Monitor', 'BedDouble', 'Bath',
  'Palette', 'Wind', 'Warehouse', 'Car', 'PanelTop', 'Hammer', 'Ruler',
  'Lightbulb', 'Phone', 'Home', 'ShieldCheck', 'Clock', 'DollarSign',
  'Eye', 'Award', 'Users', 'HeadphonesIcon', 'MessageCircle', 'Star',
  'Send', 'Maximize', 'Zap', 'ArrowLeftRight',
]

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

interface ContentFormState {
  heroTagline: string
  overviewText: string // textarea: one paragraph per line
  stats: { value: string; label: string; icon: string }[]
  features: { title: string; description: string; icon: string }[]
  advantages: { title: string; description: string; icon: string }[]
  faqs: { question: string; answer: string }[]
}

const emptyContentForm: ContentFormState = {
  heroTagline: '',
  overviewText: '',
  stats: [],
  features: [],
  advantages: [],
  faqs: [],
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [contentDialogOpen, setContentDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContentId, setEditingContentId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [contentForm, setContentForm] = useState<ContentFormState>(emptyContentForm)
  const [saving, setSaving] = useState(false)
  const [contentSaving, setContentSaving] = useState(false)
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

  // ─── Content Dialog ──────────────────────────────────────────────
  const handleOpenContent = (service: Service) => {
    setEditingContentId(service.id)
    if (service.content) {
      setContentForm({
        heroTagline: service.content.heroTagline || '',
        overviewText: JSON.parse(service.content.overview || '[]').join('\n'),
        stats: JSON.parse(service.content.stats || '[]'),
        features: JSON.parse(service.content.features || '[]'),
        advantages: JSON.parse(service.content.advantages || '[]'),
        faqs: JSON.parse(service.content.faqs || '[]'),
      })
    } else {
      setContentForm(emptyContentForm)
    }
    setContentDialogOpen(true)
  }

  const handleSaveContent = async () => {
    if (!editingContentId) return
    setContentSaving(true)
    try {
      const overview = contentForm.overviewText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const payload = {
        content: {
          heroTagline: contentForm.heroTagline,
          overview,
          stats: contentForm.stats,
          features: contentForm.features,
          advantages: contentForm.advantages,
          faqs: contentForm.faqs,
        },
      }

      const res = await fetch(`/api/admin/services/${editingContentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({ title: 'تم الحفظ', description: 'تم حفظ محتوى الصفحة بنجاح' })
        setContentDialogOpen(false)
        fetchServices()
      } else {
        const data = await res.json()
        toast({ title: 'خطأ', description: data.error || 'حدث خطأ', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' })
    } finally {
      setContentSaving(false)
    }
  }

  // Dynamic list helpers
  const addStatItem = () => {
    setContentForm((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '', icon: 'Star' }],
    }))
  }
  const removeStatItem = (idx: number) => {
    setContentForm((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }))
  }
  const updateStatItem = (idx: number, field: string, value: string) => {
    setContentForm((prev) => ({
      ...prev,
      stats: prev.stats.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }))
  }

  const addFeatureItem = () => {
    setContentForm((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', icon: 'Star' }],
    }))
  }
  const removeFeatureItem = (idx: number) => {
    setContentForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
  }
  const updateFeatureItem = (idx: number, field: string, value: string) => {
    setContentForm((prev) => ({
      ...prev,
      features: prev.features.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }))
  }

  const addAdvantageItem = () => {
    setContentForm((prev) => ({
      ...prev,
      advantages: [...prev.advantages, { title: '', description: '', icon: 'Star' }],
    }))
  }
  const removeAdvantageItem = (idx: number) => {
    setContentForm((prev) => ({ ...prev, advantages: prev.advantages.filter((_, i) => i !== idx) }))
  }
  const updateAdvantageItem = (idx: number, field: string, value: string) => {
    setContentForm((prev) => ({
      ...prev,
      advantages: prev.advantages.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }))
  }

  const addFaqItem = () => {
    setContentForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }))
  }
  const removeFaqItem = (idx: number) => {
    setContentForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }))
  }
  const updateFaqItem = (idx: number, field: string, value: string) => {
    setContentForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }))
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
                <TableHead className="text-right">المحتوى</TableHead>
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
                    <Badge className={service.content ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}>
                      {service.content ? 'موجود' : 'فارغ'}
                    </Badge>
                  </TableCell>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenContent(service)}
                        title="تعديل محتوى الصفحة"
                      >
                        <FileText className="w-4 h-4 text-blue-500" />
                      </Button>
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
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
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

      {/* Content Edit Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              تعديل محتوى الصفحة
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-2">
            <div className="space-y-6 pb-4">
              {/* Hero Tagline */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">العبارة الترويجية (Hero Tagline)</Label>
                <Textarea
                  value={contentForm.heroTagline}
                  onChange={(e) => setContentForm((prev) => ({ ...prev, heroTagline: e.target.value }))}
                  placeholder="العبارة الترويجية التي تظهر في أعلى صفحة الخدمة"
                  rows={2}
                />
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">نظرة عامة</Label>
                <p className="text-xs text-gray-400">فقرة واحدة في كل سطر</p>
                <Textarea
                  value={contentForm.overviewText}
                  onChange={(e) => setContentForm((prev) => ({ ...prev, overviewText: e.target.value }))}
                  placeholder="الفقرة الأولى&#10;الفقرة الثانية&#10;الفقرة الثالثة"
                  rows={6}
                />
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">الإحصائيات</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStatItem}>
                    <Plus className="w-3 h-3 ml-1" /> إضافة
                  </Button>
                </div>
                {contentForm.stats.map((stat, idx) => (
                  <div key={idx} className="flex gap-2 items-start border rounded-lg p-3">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">القيمة</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStatItem(idx, 'value', e.target.value)}
                          placeholder="+500"
                          dir="ltr"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">التسمية</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStatItem(idx, 'label', e.target.value)}
                          placeholder="مظلة مثبتة"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">الأيقونة</Label>
                        <select
                          value={stat.icon}
                          onChange={(e) => updateStatItem(idx, 'icon', e.target.value)}
                          className="w-full h-9 rounded-md border text-sm px-2"
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 shrink-0 mt-5"
                      onClick={() => removeStatItem(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {contentForm.stats.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">لا توجد إحصائيات</p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">الخصائص / الأنواع</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeatureItem}>
                    <Plus className="w-3 h-3 ml-1" /> إضافة
                  </Button>
                </div>
                {contentForm.features.map((feature, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-[1fr_2fr_auto] gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">العنوان</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => updateFeatureItem(idx, 'title', e.target.value)}
                            placeholder="عنوان الخاصية"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الوصف</Label>
                          <Input
                            value={feature.description}
                            onChange={(e) => updateFeatureItem(idx, 'description', e.target.value)}
                            placeholder="وصف الخاصية"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الأيقونة</Label>
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeatureItem(idx, 'icon', e.target.value)}
                            className="w-full h-9 rounded-md border text-sm px-2"
                          >
                            {ICON_OPTIONS.map((icon) => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 shrink-0 mt-5"
                        onClick={() => removeFeatureItem(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {contentForm.features.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">لا توجد خصائص</p>
                )}
              </div>

              {/* Advantages */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">المميزات</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAdvantageItem}>
                    <Plus className="w-3 h-3 ml-1" /> إضافة
                  </Button>
                </div>
                {contentForm.advantages.map((adv, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-[1fr_2fr_auto] gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">العنوان</Label>
                          <Input
                            value={adv.title}
                            onChange={(e) => updateAdvantageItem(idx, 'title', e.target.value)}
                            placeholder="عنوان الميزة"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الوصف</Label>
                          <Input
                            value={adv.description}
                            onChange={(e) => updateAdvantageItem(idx, 'description', e.target.value)}
                            placeholder="وصف الميزة"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الأيقونة</Label>
                          <select
                            value={adv.icon}
                            onChange={(e) => updateAdvantageItem(idx, 'icon', e.target.value)}
                            className="w-full h-9 rounded-md border text-sm px-2"
                          >
                            {ICON_OPTIONS.map((icon) => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 shrink-0 mt-5"
                        onClick={() => removeAdvantageItem(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {contentForm.advantages.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">لا توجد مميزات</p>
                )}
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">الأسئلة الشائعة</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
                    <Plus className="w-3 h-3 ml-1" /> إضافة
                  </Button>
                </div>
                {contentForm.faqs.map((faq, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">السؤال</Label>
                          <Input
                            value={faq.question}
                            onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                            placeholder="السؤال"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الإجابة</Label>
                          <Input
                            value={faq.answer}
                            onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                            placeholder="الإجابة"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 shrink-0 mt-5"
                        onClick={() => removeFaqItem(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {contentForm.faqs.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">لا توجد أسئلة شائعة</p>
                )}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveContent}
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={contentSaving}
              >
                {contentSaving ? 'جاري الحفظ...' : 'حفظ محتوى الصفحة'}
              </Button>
            </div>
          </ScrollArea>
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
