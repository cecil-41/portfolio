import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Clock, Copy, Check, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: {
    id: number;
    title: string;
    excerpt: string;
    content?: string;
    date: string;
    author: string;
    readTime: string;
    category: string;
    image: string;
    references?: Array<{
      title: string;
      url: string;
      description: string;
    }>;
  } | null;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, blog }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  // Reset scroll progress when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
    }
  }, [isOpen]);

  // Copy code to clipboard
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (!blog) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // typed as any to avoid strict transition typing mismatches across framer-motion versions
  const modalVariants: any = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50"
          />

          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 right-0 z-60 h-1 bg-slate-200 dark:bg-slate-700">
            <motion.div
              className="h-full bg-linear-to-r from-purple-400 to-pink-500"
              style={{ width: `${scrollProgress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-400 hover:text-white transition-all duration-300"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </motion.button>

                {/* Hero Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-linear-to-r from-purple-400 to-pink-500 text-white text-sm font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div ref={contentRef} className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {blog.title}
                  </h2>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mb-6 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm">{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span className="text-sm">{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-sm">{blog.readTime}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-linear-to-r from-transparent via-purple-400 to-transparent mb-6" />

                  {/* Blog Content */}
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                      {blog.excerpt}
                    </p>
                    
                    {blog.content ? (
                      <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700 dark:text-slate-300" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-6 space-y-2 mb-4 text-slate-700 dark:text-slate-300" {...props} />
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
                                  className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                            <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-4 border border-slate-700" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props} />
                          ),
                          img: ({ node, ...props }) => (
                            <img className="w-full rounded-lg shadow-md my-6" {...props} />
                          ),
                        }}
                      >
                        {blog.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p>
                          This is where your full blog content would appear. You can write detailed articles,
                          tutorials, and insights here. The modal provides a clean, distraction-free reading
                          experience for your audience.
                        </p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
                          Supported Formatting:
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Regular paragraphs (separate with blank lines)</li>
                          <li>Headings: Use <code># Heading</code> for main headings</li>
                          <li>Subheadings: Use <code>## Subheading</code> for subheadings</li>
                          <li>Images: Use <code>[img:https://your-image-url.com/image.jpg]</code></li>
                          <li>Code blocks: Wrap code with <code>```</code></li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* References Section */}
                  {blog.references && blog.references.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        References
                      </h3>
                      <div className="space-y-3">
                        {blog.references.map((ref, index) => (
                          <motion.a
                            key={index}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ x: 5 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                          >
                            <ExternalLink size={18} className="mt-0.5 text-purple-500 shrink-0" />
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                                {ref.title}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {ref.description}
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Action */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-full px-6 py-3 bg-linear-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
                    >
                      Close Article
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;
