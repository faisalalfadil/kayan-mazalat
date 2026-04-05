'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import Chatbot from '@/components/chatbot';
import QuoteModal from '@/components/quote-modal';
import Hero from '@/components/sections/hero-section';
import AboutSection from '@/components/sections/about-section';
import ServicesSection from '@/components/sections/services-section';
import ProjectsSection from '@/components/sections/projects-section';
import StatsSection from '@/components/sections/stats-section';
import BlogSection from '@/components/sections/blog-section';
import CtaSection from '@/components/sections/cta-section';
import ContactForm from '@/components/contact-form';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string | null;
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string | null;
  client?: string | null;
  completedAt?: string | null;
  isFeatured: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published: boolean;
  createdAt: string;
}

interface HomeClientProps {
  services: Service[];
  projects: Project[];
  blogPosts: BlogPost[];
}

export default function HomeClient({
  services,
  projects,
  blogPosts,
}: HomeClientProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <Header onOpenQuote={() => setQuoteOpen(true)} />

      <main className="flex-1">
        <Hero onOpenQuote={() => setQuoteOpen(true)} />

        <AboutSection />

        <ServicesSection services={services} />

        <ProjectsSection projects={projects} />

        <StatsSection />

        <BlogSection posts={blogPosts} />

        <CtaSection onOpenQuote={() => setQuoteOpen(true)} />

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                تواصل معنا
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                نحن هنا <span className="text-primary">لمساعدتك</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                لا تتردد في التواصل معنا لأي استفسار أو طلب عرض سعر.
                فريقنا جاهز للإجابة على جميع أسئلتكم.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
      <WhatsAppButton />
      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
