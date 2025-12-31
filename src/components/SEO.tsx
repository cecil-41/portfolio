import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Cecil's Portfolio - Software Engineer & Full Stack Developer",
  description = "Portfolio of Cecil, a skilled Software Engineer specializing in AI integration, DevOps practices, and cloud architecture.",
  image = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop",
  url,
  type = "website",
  author = "Cecil Sithole",
  publishedTime,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description, true);
    
    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:type', type);
    
    if (url) {
      updateMetaTag('og:url', url);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    // Article specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author);
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime);
      }
    }
  }, [title, description, image, url, type, author, publishedTime]);

  return null;
};

export default SEO;
