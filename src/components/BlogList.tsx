import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Home, ChevronRight } from 'lucide-react';
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

const BlogList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = blogData;

  const categories = ['all', 'React', 'Backend', 'DevOps', 'Frontend', 'Security', 'AI'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by date (most recent first)
  const displayedPosts = filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-8"
        >
          <Link to="/" className="flex items-center gap-1 hover:text-purple-500 transition-colors">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <ChevronRight size={16} />
          <span className="text-slate-900 dark:text-white font-medium">All Articles</span>
        </motion.nav>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              All Articles
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {displayedPosts.length} {displayedPosts.length === 1 ? 'article' : 'articles'} about web development, DevOps, AI, and more
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer px-4 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-linear-to-r from-purple-400 to-pink-500 text-white shadow-glow'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        {displayedPosts.length > 0 ? (
          <motion.div
            key={`${selectedCategory}-${searchTerm}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
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
                      <span className="inline-block px-3 py-1 bg-purple-400 text-white text-xs font-semibold rounded-full">
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
                      className="inline-flex items-center gap-2 text-purple-400 dark:text-cyan-300 font-semibold hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No articles found. Try adjusting your search or filter.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
