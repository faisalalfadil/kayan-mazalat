'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, Phone, MessageCircle, Mail, MapPin, Clock, Globe, User, Lock, KeyRound, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SiteSettings {
  id: string
  companyName: string
  companyEnName: string
  phone: string
  phone2: string
  whatsapp: string
  email: string
  address: string
  workingHours: string
  twitter: string
  instagram: string
  linkedin: string
  youtube: string
  snapchat: string
  tiktok: string
  facebook: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

const defaultSettings: SiteSettings = {
  id: '',
  companyName: 'كيان القمة',
  companyEnName: 'Kayn Al-Quma',
  phone: '+966 50 000 0000',
  phone2: '',
  whatsapp: '966500000000',
  email: 'info@kayanalqimah.com',
  address: 'الرياض، المملكة العربية السعودية',
  workingHours: 'الأحد - الخميس: 8:00 ص - 6:00 م',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  snapchat: '',
  tiktok: '',
  facebook: '',
}

export default function SettingsManagement({ admin, onAdminUpdate }: { admin: AdminUser; onAdminUpdate?: (admin: AdminUser) => void }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('site')
  const { toast } = useToast()

  // Account form
  const [newName, setNewName] = useState(admin.name)
  const [newEmail, setNewEmail] = useState(admin.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.success && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: 'تم الحفظ بنجاح',
          description: 'تم تحديث إعدادات الموقع بنجاح',
        })
      } else {
        toast({
          title: 'خطأ',
          description: data.error || 'حدث خطأ أثناء الحفظ',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في الاتصال بالخادم',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAccount = async () => {
    // Validation
    if (newPassword) {
      if (!currentPassword) {
        toast({
          title: 'خطأ',
          description: 'يجب إدخال كلمة المرور الحالية',
          variant: 'destructive',
        })
        return
      }
      if (newPassword.length < 6) {
        toast({
          title: 'خطأ',
          description: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
          variant: 'destructive',
        })
        return
      }
      if (newPassword !== confirmPassword) {
        toast({
          title: 'خطأ',
          description: 'كلمة المرور الجديدة غير متطابقة',
          variant: 'destructive',
        })
        return
      }
    }

    if (!newName.trim()) {
      toast({
        title: 'خطأ',
        description: 'اسم المستخدم مطلوب',
        variant: 'destructive',
      })
      return
    }

    if (!newEmail.trim()) {
      toast({
        title: 'خطأ',
        description: 'البريد الإلكتروني مطلوب',
        variant: 'destructive',
      })
      return
    }

    setSavingAccount(true)
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: admin.id,
          newName,
          newEmail,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        // Update localStorage
        const updatedAdmin = data.admin
        localStorage.setItem('admin', JSON.stringify(updatedAdmin))
        if (onAdminUpdate) {
          onAdminUpdate(updatedAdmin)
        }
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث بيانات الحساب بنجاح',
        })
        // Reset password fields
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast({
          title: 'خطأ',
          description: data.error || 'حدث خطأ أثناء التحديث',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في الاتصال بالخادم',
        variant: 'destructive',
      })
    } finally {
      setSavingAccount(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="site" className="gap-2">
            <Globe className="w-4 h-4" />
            إعدادات الموقع
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            إعدادات الحساب
          </TabsTrigger>
        </TabsList>

        {/* Site Settings Tab */}
        <TabsContent value="site" className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5 text-orange-500" />
                معلومات الاتصال
              </CardTitle>
              <CardDescription>
                تحديث أرقام الهاتف والبريد الإلكتروني والعنوان
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    رقم الهاتف الرئيسي
                  </Label>
                  <Input
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    رقم هاتف إضافي (اختياري)
                  </Label>
                  <Input
                    value={settings.phone2}
                    onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                    placeholder="+966 55 000 0000"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  رقم الواتساب (بدون + أو مسافات)
                </Label>
                <Input
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="966500000000"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  أدخل الرقم بالصيغة الدولية بدون علامة +، مثال: 966500000000
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="info@example.com"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    العنوان
                  </Label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    placeholder="المدينة، الدولة"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  ساعات العمل
                </Label>
                <Input
                  value={settings.workingHours}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  placeholder="الأحد - الخميس: 8:00 ص - 6:00 م"
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Name */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-orange-500" />
                اسم الشركة
              </CardTitle>
              <CardDescription>
                تحديث اسم الشركة بالعربية والإنجليزية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>الاسم بالعربية</Label>
                  <Input
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    placeholder="اسم الشركة"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزية</Label>
                  <Input
                    value={settings.companyEnName}
                    onChange={(e) => setSettings({ ...settings, companyEnName: e.target.value })}
                    placeholder="Company Name"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-orange-500" />
                وسائل التواصل الاجتماعي
              </CardTitle>
              <CardDescription>
                أضف روابط حسابات التواصل الاجتماعي (اختياري)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>𝕏 تويتر</Label>
                  <Input
                    value={settings.twitter}
                    onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>📷 انستقرام</Label>
                  <Input
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>in لينكدإن</Label>
                  <Input
                    value={settings.linkedin}
                    onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>▶ يوتيوب</Label>
                  <Input
                    value={settings.youtube}
                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                    placeholder="https://youtube.com/..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label> снимок سناب شات</Label>
                  <Input
                    value={settings.snapchat}
                    onChange={(e) => setSettings({ ...settings, snapchat: e.target.value })}
                    placeholder="https://snapchat.com/..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تيك توك</Label>
                  <Input
                    value={settings.tiktok}
                    onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>فيسبوك</Label>
                  <Input
                    value={settings.facebook}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white min-w-[160px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارِ الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ الإعدادات
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Account Settings Tab */}
        <TabsContent value="account" className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-orange-500" />
                معلومات الحساب
              </CardTitle>
              <CardDescription>
                تحديث اسم المستخدم والبريد الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  اسم المستخدم
                </Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  البريد الإلكتروني (للدخول)
                </Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@example.com"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="w-5 h-5 text-orange-500" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription>
                اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-muted-foreground" />
                  كلمة المرور الحالية
                </Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية"
                  dir="ltr"
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    dir="ltr"
                  />
                </div>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  كلمة المرور غير متطابقة
                </p>
              )}
              {newPassword && newPassword.length < 6 && (
                <p className="text-sm text-amber-500 flex items-center gap-1">
                  كلمة المرور يجب أن تكون 6 أحرف على الأقل
                </p>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveAccount}
              disabled={savingAccount}
              className="bg-orange-500 hover:bg-orange-600 text-white min-w-[160px]"
            >
              {savingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارِ التحديث...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تحديث الحساب
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
