'use client';

import { MapPin, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string | null;
  location?: string | null;
  client?: string | null;
  completedAt?: Date | null;
  isFeatured: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onViewAllProjects: () => void;
}

export default function ProjectsSection({ projects, onProjectClick, onViewAllProjects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            أعمالنا
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            مشاريع <span className="text-primary">نفتخر بها</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            نفخر بإنجاز مجموعة من المشاريع المتميزة في مختلف مناطق المملكة
            العربية السعودية
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-card border cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Location badge */}
                {project.location && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-5 w-full">
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <Button
                      onClick={() => onProjectClick(project)}
                      size="sm"
                      variant="secondary"
                      className="bg-white text-foreground hover:bg-white/90"
                    >
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-1">
                  {project.title}
                </h3>
                {project.client && (
                  <p className="text-muted-foreground text-sm">
                    العميل: {project.client}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            onClick={onViewAllProjects}
            size="lg"
            variant="outline"
            className="gap-2 text-base px-8 py-6 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            <span>عرض جميع المشاريع</span>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
