'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'من نحن', href: '#about' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'مشاريعنا', href: '#projects' },
  { label: 'المدونة', href: '#blog' },
  { label: 'اتصل بنا', href: '#contact' },
];

interface HeaderProps {
  onOpenQuote: () => void;
}

export default function Header({ onOpenQuote }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navLinks.map((link) => link.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300',
                scrolled
                  ? 'bg-primary text-white'
                  : 'bg-white/20 backdrop-blur-sm text-white'
              )}>
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                'text-lg font-bold leading-tight transition-colors duration-300',
                scrolled ? 'text-primary' : 'text-white'
              )}>
                كيان القمة
              </span>
              <span className={cn(
                'text-[10px] font-medium leading-tight transition-colors duration-300',
                scrolled ? 'text-muted-foreground' : 'text-white/70'
              )}>
                للحلول الإنشائية
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  activeSection === link.href.replace('#', '')
                    ? scrolled
                      ? 'text-primary'
                      : 'text-white'
                    : scrolled
                      ? 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
                {activeSection === link.href.replace('#', '') && (
                  <motion.div
                    layoutId="activeSection"
                    className={cn(
                      'absolute bottom-0 right-0 left-0 h-0.5 rounded-full',
                      scrolled ? 'bg-primary' : 'bg-white'
                    )}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={onOpenQuote}
              size="lg"
              className={cn(
                'transition-all duration-300',
                scrolled
                  ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg'
                  : 'bg-white text-primary hover:bg-white/90 shadow-lg'
              )}
            >
              <Phone className="w-4 h-4" />
              طلب عرض سعر
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'lg:hidden transition-colors',
                  scrolled ? 'text-foreground' : 'text-white'
                )}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="text-right flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-primary">كيان القمة</div>
                  <div className="text-xs text-muted-foreground">للحلول الإنشائية</div>
                </div>
              </SheetTitle>
              <nav className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors w-full',
                        activeSection === link.href.replace('#', '')
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-accent/10 text-foreground'
                      )}
                    >
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6 px-4">
                <SheetClose asChild>
                  <Button
                    onClick={onOpenQuote}
                    className="w-full"
                    size="lg"
                  >
                    <Phone className="w-4 h-4" />
                    طلب عرض سعر
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
