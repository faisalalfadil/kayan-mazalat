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
import { Plus, Pencil, Trash2, RefreshCw, MapPin, Search, Upload, X, ImageIcon, GripVertical, Eye } from 'lucide-react'
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
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewProject, setPreviewProject] = useState<Project | null>(null)
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const multiFileInputRef = useRef<HTMLInputElement>(null)
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

  // Upload single image (main)
  const handleMainImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('files', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.urls && data.urls.length > 0) {
          setForm((prev) => ({ ...prev, image: data.urls[0] }))
          toast({ title: 'تم رفع الصورة', description: 'تم رفع الصورة الرئيسية بنجاح' })
        }
      } else {
        const errData = await res.json()
        toast({ title: 'خطأ', description: errData.error || 'فشل رفع الصورة', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في رفع الصورة', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  // Upload multiple images (gallery)
  const handleGalleryUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append('files', file))
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.urls && data.urls.length > 0) {
          const currentImages = form.images ? form.images.split(',').filter((u) => u.trim()) : []
          const newImages = [...currentImages, ...data.urls]
          setForm((prev) => ({ ...prev, images: newImages.join(', ') }))
          toast({ title: 'تم رفع الصور', description: `تم رفع ${data.urls.length} صورة بنجاح` })
        }
      } else {
        const errData = await res.json()
        toast({ title: 'خطأ', description: errData.error || 'فشل رفع الصور', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في رفع الصور', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    const images = form.images ? form.images.split(',').filter((u) => u.trim()) : []
    images.splice(index, 1)
    setForm((prev) => ({ ...prev, images: images.join(', ') }))
  }

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

  const handlePreview = (project: Project) => {
    setPreviewProject(project)
    setPreviewOpen(true)
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

  // Get all images for a project
  const getProjectImages = (project: Project): string[] => {
    const images = project.images ? project.images.split(',').filter((u) => u.trim()) : []
    return [project.image, ...images]
  }

  // Get current form gallery images
  const getFormGalleryImages = (): string[] => {
    return form.images ? form.images.split(',').filter((u) => u.trim()) : []
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
                <TableHead className="text-right">الصور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const images = getProjectImages(project)
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                          onClick={() => {
                            setLightboxImages(images)
                            setLightboxIndex(0)
                            setLightboxOpen(true)
                          }}
                        >
                          {project.image ? (
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">صورة</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {project.isFeatured && (
                              <Badge className="bg-amber-100 text-amber-700 text-xs">مميز</Badge>
                            )}
                            {images.length > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                <ImageIcon className="w-3 h-3 ml-1" />
                                {images.length}
                              </Badge>
                            )}
                          </div>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                          {images.slice(0, 3).map((img, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-md border-2 border-white overflow-hidden cursor-pointer hover:z-10 transition-all"
                              onClick={() => {
                                setLightboxImages(images)
                                setLightboxIndex(idx)
                                setLightboxOpen(true)
                              }}
                            >
                              
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {images.length > 3 && (
                            <div className="w-7 h-7 rounded-md border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                              +{images.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={project.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {project.isActive ? 'مفعّل' : 'معطّل'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handlePreview(project)} title="معاينة">
                          <Eye className="w-4 h-4" />
                        </Button>
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
                )
              })}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Main Image Upload */}
            <div className="space-y-2">
              <Label>الصورة الرئيسية *</Label>
              <div className="flex items-center gap-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
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
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="gap-1 shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'جاري الرفع...' : 'رفع'}
                </Button>
              </div>
              {/* Image preview */}
              {form.image && (
                <div className="relative w-32 h-24 rounded-lg overflow-hidden border">
                  
                  <img src={form.image} alt="معاينة" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Images Upload */}
            <div className="space-y-2">
              <Label>صور إضافية (معرض المشروع)</Label>
              <input
                ref={multiFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleGalleryUpload(e.target.files)
                    e.target.value = ''
                  }
                }}
              />
              {/* Drag & Drop Zone */}
              <div
                className={`
                  border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
                  ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                `}
                onClick={() => multiFileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleGalleryUpload(e.dataTransfer.files)
                  }
                }}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'animate-bounce text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600">
                  {uploading ? 'جاري رفع الصور...' : 'اسحب الصور هنا أو اضغط للاختيار'}
                </p>
                <p className="text-xs text-gray-400 mt-1">يمكنك رفع عدة صور دفعة واحدة (JPEG, PNG, WebP)</p>
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

              {/* Or enter URLs manually */}
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0" dir="rtl">
          {previewProject && (
            <div className="relative">
              {/* Preview Image */}
              <div className="relative h-72 sm:h-96">
                
                <img
                  src={lightboxImages.length > 0 ? lightboxImages[lightboxIndex] || previewProject.image : previewProject.image}
                  alt={previewProject.title}
                  className="w-full h-full object-cover"
                />
                {previewProject.isFeatured && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                    مشروع مميز
                  </div>
                )}
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails */}
              {getProjectImages(previewProject).length > 1 && (
                <div className="flex gap-2 px-4 py-3 bg-gray-50 overflow-x-auto">
                  {getProjectImages(previewProject).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLightboxImages(getProjectImages(previewProject))
                        setLightboxIndex(idx)
                      }}
                      className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        idx === lightboxIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{previewProject.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{previewProject.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {previewProject.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {previewProject.location}
                    </div>
                  )}
                  {previewProject.client && (
                    <span>العميل: {previewProject.client}</span>
                  )}
                  <span>{getProjectImages(previewProject).length} صورة</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

          {/* Prev */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1))
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}

          {/* Image */}
          
          <img
            src={lightboxImages[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0))
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
