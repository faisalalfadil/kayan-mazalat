'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Star, DollarSign, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'الخبرة والجودة',
    description: 'سنوات من العمل المتقن والالتزام باستخدام أجود المواد المصنوعة وفقاً لأعلى المعايير',
  },
  {
    icon: Star,
    title: 'فريق متخصص',
    description: 'مهندسون وفنيون ذوو كفاءة عالية لضمان تنفيذ دقيق واحترافي',
  },
  {
    icon: Clock,
    title: 'خدمة ما بعد البيع',
    description: 'متابعة دقيقة ومستمرة لضمان جودة العمل وكفاءة المواد المستخدمة',
  },
  {
    icon: DollarSign,
    title: 'أسعار تنافسية',
    description: 'نقدم لعملائنا أفضل الأسعار المتاحة في السوق مع الحفاظ الكامل على الجودة العالية',
  },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
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
              initial={{ opacity: 1, scale: 1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 right-2 sm:-right-6 bg-primary text-white rounded-2xl p-4 sm:p-5 shadow-xl"
            >
              <div className="text-3xl font-bold">+15</div>
              <div className="text-sm text-white/80">سنة من الخبرة</div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
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
            <p className="text-muted-foreground leading-relaxed mb-10">
              تأسست مؤسسة كيان القمة على مبدأ الجودة والابتكار، مقدمين حلولاً متكاملة لا تقتصر على المظلات والسواتر، بل تشمل أيضاً خبرتنا في تنفيذ واجهات الزجاج والكلادينج، لتوفير مظهر عصري وعملي للمباني. نلتزم بمعايير الجودة العالمية في جميع مشاريعنا.
            </p>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
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
