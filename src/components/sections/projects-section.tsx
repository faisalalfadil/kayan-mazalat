'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string | null;
  client?: string | null;
  completedAt?: Date | null;
  isFeatured: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
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
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-card border"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
