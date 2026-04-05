'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  Building2,
  Menu,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import DashboardHome from '@/components/admin/dashboard-home'
import ServicesManagement from '@/components/admin/services-management'
import ProjectsManagement from '@/components/admin/projects-management'
import BlogManagement from '@/components/admin/blog-management'
import LeadsManagement from '@/components/admin/leads-management'
import ChatMessages from '@/components/admin/chat-messages'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

type Section = 'home' | 'services' | 'projects' | 'blog' | 'leads' | 'chat'

const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'الرئيسية', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'services', label: 'الخدمات', icon: <Wrench className="w-5 h-5" /> },
  { key: 'projects', label: 'المشاريع', icon: <FolderKanban className="w-5 h-5" /> },
  { key: 'blog', label: 'المدونة', icon: <FileText className="w-5 h-5" /> },
  { key: 'leads', label: 'طلبات العملاء', icon: <Users className="w-5 h-5" /> },
  { key: 'chat', label: 'المحادثات', icon: <MessageSquare className="w-5 h-5" /> },
]

function DashboardSidebar({ admin, activeSection, onSectionChange, onLogout }: {
  admin: AdminUser;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-blue-900 text-lg leading-tight">كيان القمة</h1>
          <p className="text-xs text-blue-500">لوحة التحكم</p>
        </div>
      </div>

      <Separator />

      {/* Nav Items */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Info & Logout */}
      <div className="p-4 space-y-3">
        <div className="px-3 py-2 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-900">{admin.name}</p>
          <p className="text-xs text-gray-500">{admin.email}</p>
        </div>
        <Button
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}

function getStoredAdmin(): AdminUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('admin')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(getStoredAdmin)
  const [activeSection, setActiveSection] = useState<Section>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!admin) {
      router.push('/admin')
    }
  }, [admin, router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    toast({ title: 'تم تسجيل الخروج', description: 'تم تسجيل خروجك بنجاح' })
    router.push('/admin')
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome />
      case 'services':
        return <ServicesManagement />
      case 'projects':
        return <ProjectsManagement />
      case 'blog':
        return <BlogManagement />
      case 'leads':
        return <LeadsManagement />
      case 'chat':
        return <ChatMessages />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-l border-gray-200 shadow-sm">
        <DashboardSidebar admin={admin} activeSection={activeSection} onSectionChange={setActiveSection} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <DashboardSidebar admin={admin} activeSection={activeSection} onSectionChange={(s) => { setActiveSection(s); setSidebarOpen(false) }} onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <h1 className="font-bold text-blue-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            كيان القمة
          </h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-red-500" />
          </Button>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {navItems.find((i) => i.key === activeSection)?.label}
            </h2>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  )
}
