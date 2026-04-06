'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { RefreshCw, Eye, Trash2, Phone, Mail, Building2, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string
  company: string | null
  service: string | null
  message: string
  type: string
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  read: 'bg-blue-100 text-blue-800 border-blue-200',
  replied: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
}

const statusLabels: Record<string, string> = {
  new: 'جديد',
  read: 'مقروء',
  replied: 'تم الرد',
  closed: 'مغلق',
}

const typeLabels: Record<string, string> = {
  contact: 'تواصل',
  quote: 'طلب عرض سعر',
}

const typeColors: Record<string, string> = {
  contact: 'bg-blue-50 text-blue-700',
  quote: 'bg-purple-50 text-purple-700',
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [viewLead, setViewLead] = useState<Lead | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterType !== 'all') params.set('type', filterType)
      if (filterStatus !== 'all') params.set('status', filterStatus)

      const res = await fetch(`/api/admin/leads?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStatus])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/leads/${deletingId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'تم الحذف', description: 'تم حذف الطلب بنجاح' })
        setDeleteOpen(false)
        fetchLeads()
      } else {
        toast({ title: 'خطأ', description: 'حدث خطأ في الحذف', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' })
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdating(leadId)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        toast({
          title: 'تم التحديث',
          description: `تم تحديث حالة الطلب إلى: ${statusLabels[newStatus]}`,
        })
        fetchLeads()
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في تحديث الحالة', variant: 'destructive' })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="contact">تواصل</SelectItem>
              <SelectItem value="quote">طلب عرض سعر</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="new">جديد</SelectItem>
              <SelectItem value="read">مقروء</SelectItem>
              <SelectItem value="replied">تم الرد</SelectItem>
              <SelectItem value="closed">مغلق</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={fetchLeads}>
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">الهاتف</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {lead.company}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-600 text-sm" dir="ltr">{lead.phone}</p>
                    {lead.email && (
                      <p className="text-xs text-gray-400" dir="ltr">{lead.email}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${typeColors[lead.type] || ''}`}>
                      {typeLabels[lead.type] || lead.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusChange(lead.id, value)}
                      disabled={updating === lead.id}
                    >
                      <SelectTrigger className={`w-28 h-7 text-xs border-0 ${statusColors[lead.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewLead(lead)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingId(lead.id)
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
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا الطلب نهائياً ولا يمكن استرجاعه.
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

      {/* View Lead Details Dialog */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">الاسم</p>
                  <p className="font-medium">{viewLead.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">الهاتف</p>
                  <p className="font-medium flex items-center gap-1" dir="ltr">
                    <Phone className="w-3 h-3" />
                    {viewLead.phone}
                  </p>
                </div>
                {viewLead.email && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                    <p className="font-medium flex items-center gap-1" dir="ltr">
                      <Mail className="w-3 h-3" />
                      {viewLead.email}
                    </p>
                  </div>
                )}
                {viewLead.company && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">الشركة</p>
                    <p className="font-medium">{viewLead.company}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">النوع</p>
                  <Badge className={typeColors[viewLead.type]}>
                    {typeLabels[viewLead.type]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">الحالة</p>
                  <Badge className={statusColors[viewLead.status]}>
                    {statusLabels[viewLead.status]}
                  </Badge>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-gray-400">التاريخ</p>
                  <p className="text-sm text-gray-600">
                    {new Date(viewLead.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {viewLead.service && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">الخدمة المطلوبة</p>
                  <p className="text-sm bg-blue-50 text-blue-700 p-2 rounded-lg">{viewLead.service}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs text-gray-400">الرسالة</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  <MessageSquare className="w-3 h-3 inline-block ml-1 text-gray-400" />
                  {viewLead.message}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <p className="text-xs text-gray-400 ml-2">تحديث الحالة:</p>
                <Select
                  value={viewLead.status}
                  onValueChange={(value) => {
                    handleStatusChange(viewLead.id, value)
                    setViewLead({ ...viewLead, status: value })
                  }}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
