'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown, Phone, Award, Briefcase, Users, HardHat } from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
}

const stats = [
  { icon: Award, value: 15, suffix: '+', label: 'سنة خبرة' },
  { icon: Briefcase, value: 500, suffix: '+', label: 'مشروع' },
  { icon: Users, value: 200, suffix: '+', label: 'عميل' },
  { icon: HardHat, value: 50, suffix: '+', label: 'فريق عمل' },
];

export default function Hero({ onOpenQuote }: HeroProps) {
  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt="كيان القمة للمظلات والديكورات"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-primary/10" />
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              أكثر من 15 عاماً من الخبرة
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            كيان القمة
            <br />
            <span className="bg-gradient-to-l from-blue-300 via-blue-400 to-blue-300 bg-clip-text text-transparent">
              للمظلات والديكورات
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            مرحباً بك في مؤسسة كيان القمة، شريكك لتصميم وتنفيذ أرقى المظلات والديكورات الداخلية في المملكة. نحن نجمع بين الابتكار التقني في المظلات الكهربائية والفن المعماري في الديكورات، لنوفر لك حلولاً متكاملة ترفع من قيمة وجمالية مساحتك.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={scrollToServices}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              اكتشف خدماتنا
              <ArrowDown className="w-4 h-4 mr-1" />
            </Button>
            <Button
              onClick={onOpenQuote}
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white font-semibold px-8 h-12 text-base transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 mr-1" />
              طلب عرض سعر
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-24 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <p className="text-white/70 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
