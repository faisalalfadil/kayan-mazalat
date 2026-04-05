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
import { Separator } from '@/components/ui/separator';
import { MapPin, Building2, CalendarDays, MessageCircle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string | null;
  client?: string | null;
  completedAt?: string | null;
  isFeatured: boolean;
}

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  const scrollToContact = () => {
    onOpenChange(false);
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <Dialog open={open && !!project} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0" dir="rtl">
        {project && (
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Project Image */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {project.isFeatured && (
                <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  مشروع مميز
                </div>
              )}
            </div>

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {project.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                تفاصيل مشروع {project.title}
              </DialogDescription>
            </DialogHeader>

            {/* Project Meta */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.location && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">الموقع</div>
                    <div className="text-sm font-medium text-foreground">
                      {project.location}
                    </div>
                  </div>
                </div>
              )}
              {project.client && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">العميل</div>
                    <div className="text-sm font-medium text-foreground">
                      {project.client}
                    </div>
                  </div>
                </div>
              )}
              {project.completedAt && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">تاريخ الإنجاز</div>
                    <div className="text-sm font-medium text-foreground">
                      {new Date(project.completedAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div>
              <h4 className="font-bold text-foreground mb-3 text-base">
                عن المشروع
              </h4>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                تواصل معنا
              </Button>
            </div>
          </div>
        </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
