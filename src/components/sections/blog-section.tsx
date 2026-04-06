'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published: boolean;
  createdAt: Date;
}

interface BlogSectionProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const gradients = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
];

export default function BlogSection({ posts, onPostClick }: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            المدونة
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            آخر <span className="text-primary">المقالات</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            اطلع على أحدث المقالات والمعلومات حول عالم الساندوتش بانل والحلول
            الإنشائية
          </p>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20"
            >
              {/* Image placeholder with gradient */}
              <div
                className={`h-48 bg-gradient-to-br ${
                  gradients[index % gradients.length]
                } relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/20 text-6xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt ||
                    post.content.slice(0, 120) +
                      (post.content.length > 120 ? '...' : '')}
                </p>

                {/* Read more */}
                <button onClick={() => onPostClick(post)} className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  اقرأ المزيد
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
