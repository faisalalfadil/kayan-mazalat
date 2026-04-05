'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'الهاتف',
    value: '+966 50 000 0000',
    dir: 'ltr' as const,
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'info@kayanalqimah.com',
    dir: 'ltr' as const,
  },
  {
    icon: MapPin,
    label: 'العنوان',
    value: 'الرياض، المملكة العربية السعودية',
    dir: 'rtl' as const,
  },
  {
    icon: Clock,
    label: 'ساعات العمل',
    value: 'الأحد - الخميس: 8:00 ص - 6:00 م',
    dir: 'rtl' as const,
  },
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          type: 'contact',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
          setSubmitted(false);
        }, 3000);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Info */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-foreground">تواصل معنا</h3>
        <p className="text-muted-foreground mb-8">
          يسعدنا تواصلكم معنا. يرجى ملء النموذج أو استخدام معلومات الاتصال أدناه.
        </p>

        <div className="space-y-6">
          {contactInfo.map((item, index) => (
            <div
              key={item.label}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">
                  {item.label}
                </div>
                <div
                  className="text-muted-foreground text-sm mt-0.5"
                  dir={item.dir}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mt-8 w-full h-48 rounded-xl bg-muted/50 border flex items-center justify-center overflow-hidden">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">الرياض، المملكة العربية السعودية</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        {submitted ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-bold">تم الإرسال بنجاح!</h3>
            <p className="text-muted-foreground text-center text-sm">
              سنتواصل معك في أقرب وقت ممكن
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  الاسم الكامل <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="الاسم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  رقم الجوال <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>
                الرسالة <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !name || !phone || !message}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارِ الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  إرسال الرسالة
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
