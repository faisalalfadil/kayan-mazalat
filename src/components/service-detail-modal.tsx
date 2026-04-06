'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Layers,
  Thermometer,
  Warehouse,
  Building2,
  Wrench,
  Ruler,
  CheckCircle2,
  Phone,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  Thermometer,
  Warehouse,
  Building2,
  Building: Building2,
  Wrench,
  Ruler,
  PencilRuler: Ruler,
  HardHat: Wrench,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string | null;
  order: number;
}

interface ServiceDetailModalProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenQuote: () => void;
}

export default function ServiceDetailModal({
  service,
  open,
  onOpenChange,
  onOpenQuote,
}: ServiceDetailModalProps) {
  const IconComponent = service ? (iconMap[service.icon] || Layers) : Layers;

  // Extract bullet points from description (lines starting with - or •)
  const lines = service ? service.description.split('\n').filter((line) => line.trim()) : [];
  const mainDescription = lines
    .filter((line) => !line.trim().startsWith('-') && !line.trim().startsWith('•'))
    .join('\n');
  const features = lines.filter(
    (line) => line.trim().startsWith('-') || line.trim().startsWith('•')
  );

  return (
    <Dialog open={open && !!service} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0" dir="rtl">
        {service && (
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Service Image */}
            {service.image && (
              <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            <DialogHeader>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <IconComponent className="w-7 h-7" />
                </div>
                <DialogTitle className="text-2xl font-bold">
                  {service.title}
                </DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                تفاصيل خدمة {service.title}
              </DialogDescription>
            </DialogHeader>

            {/* Description */}
            <div className="mt-6">
              <p className="text-foreground leading-relaxed text-base whitespace-pre-line">
                {mainDescription}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mt-6 p-5 bg-muted/50 rounded-xl">
                <h4 className="font-bold text-foreground mb-4 text-base">
                  مميزات الخدمة
                </h4>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90 text-sm leading-relaxed">
                        {feature.trim().replace(/^[-•]\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-8">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onOpenQuote();
                }}
                size="lg"
                className="w-full"
              >
                <Phone className="w-4 h-4 ml-2" />
                طلب عرض سعر
              </Button>
            </div>
          </div>
        </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
