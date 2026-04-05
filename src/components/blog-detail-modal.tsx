'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, User, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published: boolean;
  createdAt: string;
}

interface BlogDetailModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BlogDetailModal({
  post,
  open,
  onOpenChange,
}: BlogDetailModalProps) {
  return (
    <Dialog open={open && !!post} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0" dir="rtl">
        {post && (
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>فريق كيان القمة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>مدونة كيان القمة</span>
              </div>
            </div>

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold leading-tight">
                {post.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {post.title}
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-6" />

            {/* Post Content */}
            <div className="prose prose-neutral max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return <div key={index} className="h-4" />;

                // Check if it's a heading (starts with # or all caps short line)
                if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                  const text = trimmed.replace(/^#+\s*/, '');
                  return (
                    <h3 key={index} className="text-lg font-bold text-foreground mt-6 mb-3">
                      {text}
                    </h3>
                  );
                }

                // Check if it's a bullet point
                if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                  return (
                    <li key={index} className="flex items-start gap-2 text-foreground/80 leading-relaxed mr-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2.5" />
                      <span>{trimmed.replace(/^[-•*]\s*/, '')}</span>
                    </li>
                  );
                }

                // Regular paragraph
                return (
                  <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
