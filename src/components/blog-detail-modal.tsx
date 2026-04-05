'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, User, BookOpen, ImageIcon, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  image?: string | null;
  images?: string | null;
  published: boolean;
  createdAt: string;
}

interface BlogDetailModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parseImages(images: string | null | undefined): string[] {
  if (!images) return [];
  return images.split(',').map(url => url.trim()).filter(url => url.length > 0);
}

export default function BlogDetailModal({
  post,
  open,
  onOpenChange,
}: BlogDetailModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!post) return null;

  const allImages = [post.image, ...parseImages(post.images)].filter(Boolean) as string[];

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <Dialog open={open && !!post} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden p-0" dir="rtl">
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

              {/* Image Gallery */}
              {allImages.length > 0 && (
                <div className="mt-6">
                  {/* Main image or first image */}
                  {allImages.length === 1 ? (
                    <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden">
                      <img
                        src={allImages[0]}
                        alt={post.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                        onClick={() => openLightbox(0)}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Featured image */}
                      <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden cursor-pointer group" onClick={() => openLightbox(0)}>
                        <img
                          src={allImages[0]}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {allImages.length} صورة
                        </div>
                      </div>

                      {/* Thumbnail grid */}
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {allImages.slice(0, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                            onClick={() => openLightbox(idx)}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {allImages.length > 4 && (
                          <div
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-muted flex items-center justify-center"
                            onClick={() => openLightbox(4)}
                          >
                            <span className="text-sm font-semibold text-muted-foreground">+{allImages.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="mt-6 text-lg text-foreground/90 font-medium leading-relaxed border-r-4 border-primary pr-4">
                  {post.excerpt}
                </p>
              )}

              <Separator className="my-6" />

              {/* Post Content */}
              <div className="prose prose-neutral max-w-none">
                {post.content.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return <div key={index} className="h-4" />;

                  if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                    const text = trimmed.replace(/^#+\s*/, '');
                    return (
                      <h3 key={index} className="text-lg font-bold text-foreground mt-6 mb-3">
                        {text}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                    return (
                      <li key={index} className="flex items-start gap-2 text-foreground/80 leading-relaxed mr-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2.5" />
                        <span>{trimmed.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    );
                  }

                  return (
                    <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Show all images at bottom if more than 4 */}
              {allImages.length > 4 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      صور المقال ({allImages.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {allImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => openLightbox(idx)}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
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
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(p => p > 0 ? p - 1 : allImages.length - 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(p => p < allImages.length - 1 ? p + 1 : 0) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              {/* Thumbnails */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[80vw] overflow-x-auto px-4 py-2">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx) }}
                    className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${
                      idx === lightboxIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
          <img
            src={allImages[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[75vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
