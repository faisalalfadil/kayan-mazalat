'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Search,
  MapPin,
  Building2,
  CalendarDays,
  ChevronRight,
  Eye,
  ImageIcon,
  Grid3X3,
  LayoutList,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  image: string;
  images?: string | null;
  location?: string | null;
  client?: string | null;
  completedAt?: string | null;
  isFeatured: boolean;
}

interface PortfolioGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProjects?: Project[];
}

// Helper to parse images field
function parseImages(images: string | null | undefined): string[] {
  if (!images) return [];
  return images.split(',').map(url => url.trim()).filter(url => url.length > 0);
}

export default function PortfolioGallery({
  open,
  onOpenChange,
  initialProjects,
}: PortfolioGalleryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterFeatured, setFilterFeatured] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [initialProjects]);

  useEffect(() => {
    if (open) {
      fetchProjects();
      document.body.style.overflow = 'hidden';
    } else {
      setSelectedProject(null);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, fetchProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.includes(search) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(search.toLowerCase())) ||
      (p.location && p.location.includes(search)) ||
      (p.client && p.client.includes(search)) ||
      p.description.includes(search);
    const matchesFeatured = !filterFeatured || p.isFeatured;
    return matchesSearch && matchesFeatured;
  });

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setLightboxIndex(0);
  };

  const getProjectImages = (project: Project): string[] => {
    const additionalImages = parseImages(project.images);
    return [project.image, ...additionalImages];
  };

  const handleLightboxPrev = () => {
    if (!selectedProject) return;
    const images = getProjectImages(selectedProject);
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleLightboxNext = () => {
    if (!selectedProject) return;
    const images = getProjectImages(selectedProject);
    setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      } else if (e.key === 'ArrowRight') {
        handleLightboxNext();
      } else if (e.key === 'ArrowLeft') {
        handleLightboxPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, lightboxIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">معرض أعمالنا</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredProjects.length} مشروع
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن مشروع..."
                className="pr-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={filterFeatured ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterFeatured(!filterFeatured)}
                className="gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                المشاريع المميزة
              </Button>

              <div className="flex items-center border rounded-lg p-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-2xl" />
                  <div className="mt-3 h-5 bg-muted rounded w-3/4" />
                  <div className="mt-2 h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {search ? 'لا توجد نتائج' : 'لا توجد مشاريع حالياً'}
              </h3>
              <p className="text-muted-foreground">
                {search ? 'جرب البحث بكلمات أخرى' : 'سيتم إضافة مشاريع قريباً'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const images = getProjectImages(project);
                return (
                  <div
                    key={project.id}
                    className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-card border cursor-pointer"
                    onClick={() => openProjectDetail(project)}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity duration-500" />
                      
                      {/* Location badge */}
                      {project.location && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {project.location}
                        </div>
                      )}

                      {/* Featured badge */}
                      {project.isFeatured && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                          مشروع مميز
                        </div>
                      )}

                      {/* Images count */}
                      {images.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {images.length} صورة
                        </div>
                      )}

                      {/* Hover overlay content */}
                      <div className="absolute inset-0 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity duration-500">
                        <Button
                          variant="secondary"
                          className="bg-white text-foreground hover:bg-white/90 shadow-lg gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectDetail(project);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground text-base mb-2 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {project.client && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {project.client}
                          </div>
                        )}
                        {project.completedAt && (
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {new Date(project.completedAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const images = getProjectImages(project);
                return (
                  <div
                    key={project.id}
                    className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => openProjectDetail(project)}
                  >
                    <div className="relative w-full sm:w-64 h-48 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {project.isFeatured && (
                        <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">
                          مميز
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-foreground text-lg mb-2">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                        {project.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {project.location}
                          </div>
                        )}
                        {project.client && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {project.client}
                          </div>
                        )}
                        {images.length > 1 && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            {images.length} صورة
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-primary font-medium mr-auto">
                          <span>عرض التفاصيل</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Project Detail Overlay */}
      {selectedProject && (
        <ProjectDetailOverlay
          project={selectedProject}
          lightboxIndex={lightboxIndex}
          onClose={() => setSelectedProject(null)}
          onPrev={handleLightboxPrev}
          onNext={handleLightboxNext}
          onLightboxChange={setLightboxIndex}
        />
      )}
    </div>
  );
}

/* ============================================ */
/* Project Detail with Image Gallery/Lightbox   */
/* ============================================ */

function ProjectDetailOverlay({
  project,
  lightboxIndex,
  onClose,
  onPrev,
  onNext,
  onLightboxChange,
}: {
  project: Project;
  lightboxIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLightboxChange: (index: number) => void;
}) {
  const images = getProjectImagesLocal(project);
  const currentImage = images[lightboxIndex] || project.image;

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm"
      dir="rtl"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main content - Split layout */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* Image Gallery - Left/Main side */}
        <div className="flex-1 relative flex flex-col">
          {/* Main Image / Lightbox */}
          <div className="flex-1 relative min-h-0">
            
            <img
              src={currentImage}
              alt={`${project.title} - صورة ${lightboxIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex-shrink-0 bg-black/80 px-4 py-3 overflow-x-auto">
              <div className="flex gap-2 justify-center min-w-max mx-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onLightboxChange(idx)}
                    className={cn(
                      'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all border-2',
                      idx === lightboxIndex
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    
                    <img
                      src={img}
                      alt={`صورة مصغرة ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Info - Right side */}
        <div className="w-full lg:w-96 bg-white flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {project.title}
            </h2>

            {/* Meta info */}
            <div className="space-y-3 mb-6">
              {project.location && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">الموقع</div>
                    <div className="text-sm font-medium">{project.location}</div>
                  </div>
                </div>
              )}
              {project.client && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">العميل</div>
                    <div className="text-sm font-medium">{project.client}</div>
                  </div>
                </div>
              )}
              {project.completedAt && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">تاريخ الإنجاز</div>
                    <div className="text-sm font-medium">
                      {new Date(project.completedAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="h-px bg-border mb-6" />

            {/* Description */}
            <div>
              <h4 className="font-bold text-foreground mb-3">عن المشروع</h4>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
                {project.description}
              </p>
            </div>

            {/* Gallery info */}
            {images.length > 1 && (
              <>
                <div className="h-px bg-border my-6" />
                <div>
                  <h4 className="font-bold text-foreground mb-3">
                    صور المشروع ({images.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => onLightboxChange(idx)}
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden transition-all border-2',
                          idx === lightboxIndex
                            ? 'border-primary'
                            : 'border-transparent hover:border-muted-foreground/30'
                        )}
                      >
                        
                        <img
                          src={img}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CTA */}
            <div className="mt-8">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) {
                      const offset = 80;
                      const top = element.getBoundingClientRect().top + window.scrollY - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }, 300);
                }}
              >
                تواصل معنا بخصوص هذا المشروع
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getProjectImagesLocal(project: Project): string[] {
  const additionalImages = parseImages(project.images);
  return [project.image, ...additionalImages];
}
