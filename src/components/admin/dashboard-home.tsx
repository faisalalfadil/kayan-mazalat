'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Wrench, FolderKanban, Users, FileText } from 'lucide-react'

interface Stats {
  services: number
  projects: number
  leads: number
  blogPosts: number
  recentLeads: {
    id: string
    name: string
    email: string | null
    phone: string
    type: string
    status: string
    createdAt: string
  }[]
}

const statusColors: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  read: 'bg-orange-50 text-orange-800 border-orange-100',
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

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'الخدمات',
      value: stats?.services || 0,
      icon: <Wrench className="w-6 h-6" />,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 text-orange-500',
    },
    {
      title: 'المشاريع',
      value: stats?.projects || 0,
      icon: <FolderKanban className="w-6 h-6" />,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'طلبات العملاء',
      value: stats?.leads || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'المقالات',
      value: stats?.blogPosts || 0,
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.lightColor} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">آخر طلبات العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-2 font-medium text-gray-500">الاسم</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">الهاتف</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">النوع</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">الحالة</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{lead.name}</td>
                      <td className="py-3 px-2 text-gray-600" dir="ltr">{lead.phone}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[lead.type] || lead.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={`text-xs ${statusColors[lead.status] || ''}`}>
                          {statusLabels[lead.status] || lead.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-500 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">لا توجد طلبات حتى الآن</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
