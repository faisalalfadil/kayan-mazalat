'use client';

import { useEffect, useState } from 'react';
import HomeClient from '@/components/home-client';

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

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/blog').then(r => r.json()),
    ])
      .then(([servicesData, projectsData, blogData]) => {
        if (servicesData.success) setServices(servicesData.services);
        if (projectsData.success) setProjects(projectsData.projects);
        if (blogData.success) setBlogPosts(blogData.posts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HomeClient
        services={services}
        projects={projects}
        blogPosts={blogPosts}
      />
    </div>
  );
}
