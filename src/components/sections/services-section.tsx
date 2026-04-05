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
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesSection({ services }: ServicesSectionProps) {
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
            حلول إنشائية <span className="text-primary">متكاملة</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            نقدم مجموعة شاملة من الخدمات الإنشائية المتخصصة في توريد وتركيب
            الساندوتش بانل والعزل الحراري بأعلى معايير الجودة
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Layers;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <button className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    اعرف المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
