'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import Chatbot from '@/components/chatbot';
import QuoteModal from '@/components/quote-modal';
import ServiceDetailModal from '@/components/service-detail-modal';
import ProjectDetailModal from '@/components/project-detail-modal';
import BlogDetailModal from '@/components/blog-detail-modal';
import PortfolioGallery from '@/components/portfolio-gallery';
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
  images?: string | null;
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectModalOpen(true);
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setBlogModalOpen(true);
  };

  const handleOpenQuote = () => setQuoteOpen(true);

  return (
    <>
      <Header onOpenQuote={handleOpenQuote} />

      <main className="flex-1">
        <Hero onOpenQuote={handleOpenQuote} />

        <AboutSection />

        <ServicesSection
          services={services}
          onServiceClick={handleServiceClick}
        />

        <ProjectsSection
          projects={projects}
          onProjectClick={handleProjectClick}
          onViewAllProjects={() => setPortfolioOpen(true)}
        />

        <StatsSection />

        <BlogSection
          posts={blogPosts}
          onPostClick={handlePostClick}
        />

        <CtaSection onOpenQuote={handleOpenQuote} />

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

      {/* Modals */}
      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} />
      <ServiceDetailModal
        service={selectedService}
        open={serviceModalOpen}
        onOpenChange={setServiceModalOpen}
        onOpenQuote={handleOpenQuote}
      />
      <ProjectDetailModal
        project={selectedProject}
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
      />
      <BlogDetailModal
        post={selectedPost}
        open={blogModalOpen}
        onOpenChange={setBlogModalOpen}
      />

      {/* Portfolio Gallery */}
      <PortfolioGallery
        open={portfolioOpen}
        onOpenChange={setPortfolioOpen}
      />
    </>
  );
}
