'use client';

import { motion } from 'framer-motion';
import {
  TreePine,
  Diamond,
  Columns3,
  Sparkles,
  LayoutGrid,
  Wallpaper,
  Square,
  SquareStack,
  Monitor,
  BedDouble,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const decorationFeatures: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: TreePine,
    title: 'بديل خشب',
    description:
      'ألواح بديل الخشب بألوان وأشكال متعددة تناسب جميع الأذواق، مثالية للجدران والأرضيات',
  },
  {
    icon: Diamond,
    title: 'بديل رخام',
    description:
      'ديكورات بديل الرخام للجدران والأرضيات بمنظر فاخر ومقاومة عالية للماء والاستهلاك',
  },
  {
    icon: Columns3,
    title: 'بارتشن وقواطع',
    description:
      'بارتشنات خشبية ثابتة ومتحركة لفصل المساحات بتصاميم عصرية وأنيقة',
  },
  {
    icon: Sparkles,
    title: 'ديكورات فوم',
    description:
      'إطارات وبراويز فوم للجدران بأشكال كلاسيكية وعصرية بأفضل الأسعار',
  },
  {
    icon: LayoutGrid,
    title: 'جبس بورد',
    description:
      'ديكورات جبس بورد للأسقف والجدران مع إضاءة LED مخفية للمسة فخامة',
  },
  {
    icon: Wallpaper,
    title: 'ورق جدران 3D',
    description:
      'تشكيلة واسعة من ورق الجدران بتصاميم حديثة مع إمكانية الطباعة حسب الطلب',
  },
  {
    icon: Square,
    title: 'مرايا جدارية',
    description:
      'تفصيل مرايا بأشكال متنوعة (طولية، دائرية) لاستغلال المساحات وإضفاء الفخامة',
  },
  {
    icon: SquareStack,
    title: 'باركيه SPC',
    description:
      'أرضيات باركيه عصرية مقاومة للماء والمسحوق بألوان خشبية طبيعية متعددة',
  },
  {
    icon: Monitor,
    title: 'خلفيات تلفزيون',
    description:
      'تصميم وتنفيذ خلفيات تلفزيون من بديل الخشب والرخام بمقاسات مخصصة',
  },
  {
    icon: BedDouble,
    title: 'هيدبورد غرف نوم',
    description:
      'تفصيل هيدبورد بأشكال عصرية وكلاسيكية من قماش وخشب لغرف النوم',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DecorationFeatures() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            تشكيلة متكاملة
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            أعمال الديكورات{' '}
            <span className="text-primary">الداخلية</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            نقدم تشكيلة واسعة من حلول الديكورات الداخلية لتحويل مساحتك
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5"
        >
          {decorationFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-card border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 text-center"
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-xs leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
