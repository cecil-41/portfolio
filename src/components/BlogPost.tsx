import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Copy, Check, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import blogData from '../data/blogs.json';
import SEO from './SEO';

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
  references?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const blog = blogData.find((post: BlogPost) => post.slug === slug);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Update page title
  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | Cecil's Portfolio`;
    }
    return () => {
      document.title = "Cecil's Portfolio";
    };
  }, [blog]);

  // Copy code to clipboard
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  // Share blog post
  const shareBlog = async () => {
    const url = window.location.href;
    const text = `Check out this article: ${blog?.title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: blog?.title, text, url });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20">
      {/* SEO Meta Tags */}
      {blog && (
        <SEO
          title={`${blog.title} | Cecil's Blog`}
          description={blog.excerpt}
          image={blog.image}
          url={window.location.href}
          type="article"
          author={blog.author}
          publishedTime={blog.date}
        />
      )}

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200 dark:bg-slate-700">
        <motion.div
          className="h-full bg-linear-to-r from-purple-400 to-pink-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-96 overflow-hidden"
      >
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />

        {/* Badge & Button Container - Aligned with Navigation */}
        <div className="absolute top-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Category Badge - Left */}
            <span className="px-4 py-2 bg-linear-to-r from-purple-400 to-pink-500 text-white text-sm font-semibold rounded-full">
              {blog.category}
            </span>

            {/* Back Button - Right */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/#blog')}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-purple-400 text-purple-400 dark:border-cyan-300 dark:text-cyan-300 bg-white/10 dark:bg-slate-900/50 backdrop-blur-sm rounded-full font-semibold hover:bg-purple-400/10 dark:hover:bg-cyan-300/10 transition-all shadow-lg"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to All Articles</span>
              <span className="sm:hidden">Back</span>
            </motion.button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {blog.title}
            </motion.h1>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Info & Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(blog.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{blog.readTime} min read</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareBlog}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-slate-700 transition-colors"
          >
            {shareSuccess ? (
              <>
                <Check size={18} />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 size={18} />
                Share
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic border-l-4 border-purple-400 pl-6 py-2">
            {blog.excerpt}
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="prose prose-lg prose-slate dark:prose-invert max-w-none"
        >
          {blog.content ? (
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-10 mb-4" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                code: ({ node, inline, className, children, ...props }: any) => {
                  const codeString = String(children).replace(/\n$/, '');
                  const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

                  return !inline ? (
                    <div className="relative group">
                      <button
                        onClick={() => copyToClipboard(codeString, codeId)}
                        className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                        title="Copy code"
                      >
                        {copiedCode === codeId ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800 dark:text-slate-200" {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ node, ...props }) => (
                  <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-6 border border-slate-700" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props} />
                ),
                img: ({ node, ...props }) => (
                  <img className="w-full rounded-lg shadow-md my-8" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-purple-400 pl-4 py-2 italic text-slate-600 dark:text-slate-400 my-6" {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          ) : (
            <p className="text-slate-700 dark:text-slate-300">Content not available.</p>
          )}
        </motion.div>

        {/* References Section */}
        {blog.references && blog.references.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              References & Further Reading
            </h3>
            <div className="space-y-3">
              {blog.references.map((ref, index) => (
                <motion.a
                  key={index}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group border border-slate-200 dark:border-slate-700"
                >
                  <ExternalLink size={20} className="mt-0.5 text-purple-500 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      {ref.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {ref.description}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related/More Articles CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Check out more articles on web development, DevOps, and software engineering.
          </p>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all"
            style={{ color: 'white' }}
          >
            View All Articles
          </Link>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;
