'use client';

import { motion } from 'framer-motion';
import {
  Layers,
  Thermometer,
  Warehouse,
  Building2,
  Wrench,
  Ruler,
  ArrowLeft,
  Sun,
  Paintbrush,
  Tv,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Map icon names from DB to Lucide components
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
  Sun,
  Paintbrush,
  PaintBrush: Paintbrush,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string | null;
  order: number;
}

interface ServicesSectionProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Map service titles to gradient colors
const gradients: Record<string, string> = {
  '1': 'from-amber-500 to-orange-600',
  '2': 'from-orange-500 to-rose-500',
  '3': 'from-sky-500 to-cyan-500',
};

export default function ServicesSection({ services, onServiceClick }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 md:py-28 bg-muted/30">
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
            خدماتنا
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            خدمات <span className="text-primary">متكاملة</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            نقدم مجموعة شاملة من الخدمات المتخصصة في المظلات الكهربائية وبديل الشيبود مُلاي والديكورات الداخلية بأعلى معايير الجودة
          </p>
        </motion.div>

        {/* Services Grid - Featured cards with gradient icons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Layers;
            const gradient = gradients[service.order.toString()] || 'from-primary to-primary/80';
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/20"
              >
                {/* Top gradient bar with icon */}
                <div className={`relative bg-gradient-to-l ${gradient} p-6`}>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
                  <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-5">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => onServiceClick(service)}
                    className="text-primary text-sm font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                  >
                    اعرف المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {[
            { icon: Sun, text: 'تصاميم عصرية' },
            { icon: Droplets, text: 'مواد مقاومة للماء' },
            { icon: Tv, text: 'تنفيذ احترافي' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
