import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import blogData from '../data/blogs.json';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: number;
  category: string;
  image: string;
  slug: string;
  content?: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = blogData;

  // Show only top 6 most recent posts on homepage
  const displayedPosts = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-deep-950 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Blog & Insights
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Latest insights on web dev, AI, cloud, and software dev best practices
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
            {displayedPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group bg-white dark:bg-deep-800 rounded-xl overflow-hidden border border-slate-200/70 dark:border-purple-900/30 shadow-card hover:shadow-card-hover hover:border-purple-400/40 dark:hover:border-purple-500/40 transition-all duration-300 flex flex-col h-full"
              >
                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-glow">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {post.author}
                      </div>
                      <div className="ml-auto">{post.readTime} min read</div>
                    </div>

                    {/* Read More Button */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="inline-flex items-center gap-2 text-purple-500 dark:text-purple-400 font-semibold hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-glow hover:shadow-glow-pink transition-all"
              style={{ color: 'white' }}
            >
              View All Articles
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    );
  };

export default Blog;
