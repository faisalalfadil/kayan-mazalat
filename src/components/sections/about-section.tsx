'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Shield,
  Star,
  DollarSign,
  Clock,
  CheckCircle2,
  Paintbrush,
  Layers,
  Sun,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'خبرة أكثر من 15 عاماً',
    description: 'سنوات من العمل المتقن والالتزام باستخدام أجود المواد المصنوعة وفقاً لأعلى المعايير العالمية',
  },
  {
    icon: Star,
    title: 'فريق فني متخصص',
    description: 'مهندسون وفنيون ذوو كفاءة عالية لضمان تنفيذ دقيق واحترافي لكل مشروع',
  },
  {
    icon: Clock,
    title: 'التزام بالمواعيد',
    description: 'نلتزم بجدول زمني محدد لإنجاز مشاريعكم في الوقت المحدد دون تأخير',
  },
  {
    icon: DollarSign,
    title: 'أسعار تنافسية',
    description: 'نقدم لعملائنا أفضل الأسعار المتاحة في السوق مع الحفاظ الكامل على الجودة العالية',
  },
];

const serviceAreas = [
  { icon: Paintbrush, label: 'مجالس وغرف' },
  { icon: Layers, label: 'صالات ومداخل' },
  { icon: Sun, label: 'مطابخ وحمامات' },
  { icon: CheckCircle2, label: 'فلل ومنازل' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about.png"
                alt="كيان القمة للمظلات والديكورات"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 right-2 sm:-right-6 bg-primary text-white rounded-2xl p-4 sm:p-5 shadow-xl"
            >
              <div className="text-3xl font-bold">+15</div>
              <div className="text-sm text-white/80">سنة من الخبرة</div>
            </motion.div>
            {/* Floating badge top-left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              viewport={{ once: true }}
              className="absolute -top-3 left-2 sm:-left-6 bg-white text-primary rounded-2xl p-3 sm:p-4 shadow-xl border border-primary/10"
            >
              <div className="text-2xl font-bold">+500</div>
              <div className="text-xs text-muted-foreground">مشروع منجز</div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              من نحن
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              كيان القمة: الريادة في حلول التظليل
              <br />
              <span className="text-primary">وواجهات المباني</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              تأسست مؤسسة كيان القمة على مبدأ الجودة والابتكار، مقدمين حلولاً متكاملة في المظلات الكهربائية والديكورات الداخلية، لتوفير مظهر عصري وعملي لمشاريعكم.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              نقدم خدمات ديكورات داخلية متكاملة تشمل بديل الخشب والرخام والباركيه والجبس بورد، بالإضافة إلى بديل الشيبود مُلاي بتصاميم عصرية ومتانة عالية. نلتزم بمعايير الجودة العالمية في جميع مشاريعنا.
            </p>

            {/* Service Areas - Compact pills */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-foreground mb-3">نخدم جميع المساحات:</p>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <div
                    key={area.label}
                    className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-border/50"
                  >
                    <area.icon className="w-3.5 h-3.5 text-primary" />
                    {area.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/30 hover:border-primary/20 hover:bg-muted/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
