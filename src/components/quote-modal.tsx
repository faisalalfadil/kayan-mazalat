'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const panelTypes = [
  { value: 'standard', label: 'ساندوتش بانل عادي', price: 85 },
  { value: 'thermal', label: 'ساندوتش بانل عزل حراري', price: 120 },
  { value: 'acoustic', label: 'ساندوتش بانل عزل صوتي', price: 150 },
];

const thicknesses = [40, 50, 60, 75, 80, 100, 120, 150, 200];

const colors = [
  { value: 'white', label: 'أبيض', color: '#FFFFFF' },
  { value: 'silver', label: 'فضي', color: '#C0C0C0' },
  { value: 'red', label: 'أحمر', color: '#DC2626' },
  { value: 'blue', label: 'أزرق', color: '#2563EB' },
  { value: 'green', label: 'أخضر', color: '#16A34A' },
  { value: 'beige', label: 'بيج', color: '#D4A574' },
];

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const [panelType, setPanelType] = useState('');
  const [thickness, setThickness] = useState('');
  const [area, setArea] = useState('');
  const [color, setColor] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedPanel = panelTypes.find((p) => p.value === panelType);
  const thicknessMultiplier = thickness ? parseInt(thickness) / 50 : 1;
  const areaValue = parseFloat(area) || 0;
  const estimatedPrice =
    selectedPanel && areaValue > 0
      ? Math.round(selectedPanel.price * areaValue * thicknessMultiplier)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !panelType || !area) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          service: selectedPanel?.label,
          message: `نوع البانل: ${selectedPanel?.label}\nالسمك: ${thickness}mm\nالمساحة: ${area} م²\nاللون: ${colors.find((c) => c.value === color)?.label || 'غير محدد'}\nالسعر التقديري: ${estimatedPrice.toLocaleString()} ريال\nملاحظات: ${notes}`,
          type: 'quote',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 2500);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setPanelType('');
      setThickness('');
      setArea('');
      setColor('');
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
      setSubmitted(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold">تم إرسال طلبك بنجاح!</h3>
            <p className="text-muted-foreground text-center text-sm">
              سيتواصل معك فريقنا خلال 24 ساعة
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Calculator className="w-5 h-5 text-primary" />
                طلب عرض سعر
              </DialogTitle>
              <DialogDescription>
                احصل على تقدير سريع لتكلفة مشروعك
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              {/* Panel Details */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
                <h4 className="font-semibold text-sm text-primary">
                  تفاصيل البانل
                </h4>

                <div className="space-y-2">
                  <Label>نوع البانل *</Label>
                  <Select value={panelType} onValueChange={setPanelType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر نوع البانل" />
                    </SelectTrigger>
                    <SelectContent>
                      {panelTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>السمك (مم)</Label>
                    <Select value={thickness} onValueChange={setThickness}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر السمك" />
                      </SelectTrigger>
                      <SelectContent>
                        {thicknesses.map((t) => (
                          <SelectItem key={t} value={String(t)}>
                            {t} مم
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>المساحة (م²) *</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="المساحة"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          color === c.value
                            ? 'border-primary ring-2 ring-primary/30 scale-110'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimated Price */}
              {estimatedPrice > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      السعر التقديري
                    </span>
                    <div className="text-left">
                      <span className="text-2xl font-bold text-primary">
                        {estimatedPrice.toLocaleString('ar-SA')}
                      </span>
                      <span className="text-sm text-muted-foreground mr-1">
                        ريال
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    * سعر تقديري فقط وقد يختلف حسب متطلبات المشروع
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-primary">
                  بيانات التواصل
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>الاسم الكامل *</Label>
                    <Input
                      placeholder="الاسم"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الجوال *</Label>
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
                  <Label>ملاحظات إضافية</Label>
                  <Textarea
                    placeholder="أي تفاصيل إضافية عن المشروع..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || !name || !phone || !panelType || !area}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جارِ الإرسال...
                  </>
                ) : (
                  'إرسال طلب عرض السعر'
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
