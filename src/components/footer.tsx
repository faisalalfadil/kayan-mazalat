'use client';

import { Building2, Phone, Mail, MapPin, Clock, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { SiteSettings } from '@/lib/types';

const quickLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'من نحن', href: '#about' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'مشاريعنا', href: '#projects' },
  { label: 'المدونة', href: '#blog' },
  { label: 'اتصل بنا', href: '#contact' },
];

const serviceLinks = [
  'ساندوتش بانل',
  'عزل حراري',
  'هناجر صناعية',
  'مباني صناعية',
  'صاج ومعادن',
  'تصميم هندسي',
];

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyName = settings?.companyName || 'كيان القمة';
  const phone = settings?.phone || '+966 50 000 0000';
  const phone2 = settings?.phone2 || '';
  const email = settings?.email || 'info@kayanalqimah.com';
  const address = settings?.address || 'الرياض، المملكة العربية السعودية';
  const workingHours = settings?.workingHours || 'الأحد - الخميس: 8:00 ص - 6:00 م';

  // Build social links from settings
  const socialLinks: { label: string; href: string; icon: string }[] = [];
  if (settings?.twitter) socialLinks.push({ label: 'تويتر', href: settings.twitter, icon: '𝕏' });
  if (settings?.instagram) socialLinks.push({ label: 'انستقرام', href: settings.instagram, icon: '📷' });
  if (settings?.linkedin) socialLinks.push({ label: 'لينكدإن', href: settings.linkedin, icon: 'in' });
  if (settings?.youtube) socialLinks.push({ label: 'يوتيوب', href: settings.youtube, icon: '▶' });
  if (settings?.snapchat) socialLinks.push({ label: 'سناب شات', href: settings.snapchat, icon: '👻' });
  if (settings?.tiktok) socialLinks.push({ label: 'تيك توك', href: settings.tiktok, icon: '♪' });
  if (settings?.facebook) socialLinks.push({ label: 'فيسبوك', href: settings.facebook, icon: 'f' });

  // Fallback social links if none are configured
  const displaySocials = socialLinks.length > 0 ? socialLinks : [
    { label: 'تويتر', href: '#', icon: '𝕏' },
    { label: 'انستقرام', href: '#', icon: '📷' },
    { label: 'لينكدإن', href: '#', icon: 'in' },
    { label: 'يوتيوب', href: '#', icon: '▶' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      {/* Back to top */}
      <div className="flex justify-center -mt-5">
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold">{companyName}</div>
                <div className="text-xs text-white/60">للحلول الإنشائية</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              شركة متخصصة في توريد وتركيب الساندوتش بانل والعزل الحراري على مستوى
              المملكة العربية السعودية. نقدم حلولاً إنشائية متكاملة بأعلى معايير
              الجودة.
            </p>
            <div className="flex gap-3 flex-wrap">
              {displaySocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-lg bg-white/10 hover:bg-primary text-white/70 hover:text-white flex items-center justify-center text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-6 relative">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-10 h-0.5 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-primary text-sm transition-colors duration-200 hover:pr-2"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold mb-6 relative">
              خدماتنا
              <span className="absolute -bottom-2 right-0 w-10 h-0.5 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <span className="text-white/60 text-sm">• {service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold mb-6 relative">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-10 h-0.5 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="text-white/60 text-sm">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-white/60 hover:text-primary text-sm transition-colors" dir="ltr">
                    {phone}
                  </a>
                  {phone2 && (
                    <a href={`tel:${phone2.replace(/\s/g, '')}`} className="text-white/60 hover:text-primary text-sm transition-colors" dir="ltr">
                      {phone2}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="text-white/60 hover:text-primary text-sm transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="text-white/60 text-sm">
                  {workingHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} {companyName}. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <span className="text-white/40 text-sm hover:text-white/60 cursor-pointer transition-colors">
              سياسة الخصوصية
            </span>
            <span className="text-white/40 text-sm hover:text-white/60 cursor-pointer transition-colors">
              الشروط والأحكام
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
