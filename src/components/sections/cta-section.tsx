'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, ArrowDown } from 'lucide-react';

interface CtaSectionProps {
  onOpenQuote: () => void;
}

export default function CtaSection({ onOpenQuote }: CtaSectionProps) {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/95 via-primary to-primary/90" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            جاهز لبدء
            <br />
            <span className="text-blue-200">مشروعك؟</span>
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            تواصل معنا اليوم واحصل على استشارة مجانية وعرض سعر مناسب
            لمشروعك. فريقنا جاهز لمساعدتك في تحقيق رؤيتك الإنشائية.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-xl transition-all hover:-translate-y-0.5"
            >
              <ArrowDown className="w-4 h-4" />
              تواصل معنا
            </Button>
            <Button
              onClick={onOpenQuote}
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white font-semibold px-8 h-12 text-base transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              طلب عرض سعر
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
