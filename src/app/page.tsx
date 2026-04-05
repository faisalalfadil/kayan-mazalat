import { db } from '@/lib/db';
import HomeClient from '@/components/home-client';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Home() {
  try {
    const [services, projects, blogPosts] = await Promise.all([
      db.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      }),
      db.project.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

    return (
      <div className="min-h-screen flex flex-col">
        <HomeClient
          services={JSON.parse(JSON.stringify(services))}
          projects={JSON.parse(JSON.stringify(projects))}
          blogPosts={JSON.parse(JSON.stringify(blogPosts))}
        />
      </div>
    );
  } catch (error) {
    console.error('Database error:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <HomeClient
          services={[]}
          projects={[]}
          blogPosts={[]}
        />
      </div>
    );
  }
}
