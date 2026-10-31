import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeProvider';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Blog from './components/Blog';
import Contact from './components/Contact';
import ScrollProgress from './components/ScrollProgress';
import Stats from './components/Stats';
import BackToTop from './components/BackToTop';
import Testimonials from './components/Testimonials';
import Qualifications from './components/Qualifications';
import SEO from './components/SEO';
import Footer from './components/Footer';

// Blog routes live in their own chunks, so react-markdown and highlight.js stay off the homepage.
const BlogList = lazy(() => import('./components/BlogList'));
const BlogPost = lazy(() => import('./components/BlogPost'));

function HomePage() {
  return (
    <>
      <SEO />
      <Hero />
      <Stats />
      <Skills />
      <Experience />
      <Qualifications />
      <Testimonials />
      <Blog />
      <Contact />
    </>
  );
}

/** Quiet placeholder while a blog route chunk loads: the page frame, no spinner. */
function RouteFallback() {
  return (
    <main className="min-h-svh pt-16" aria-busy="true">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <p className="sr-only" role="status">
          Loading
        </p>
        <div aria-hidden="true" className="max-w-3xl">
          <div className="h-3 w-28 rounded-full bg-surface-2" />
          <div className="mt-6 h-10 w-3/4 rounded-lg bg-surface-2 sm:h-12" />
          <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-surface" />
          <div className="mt-2 h-4 w-2/3 max-w-md rounded-full bg-surface" />
        </div>
        <div aria-hidden="true" className="mt-12 h-px w-full bg-line" />
      </div>
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollProgress />
        <Navigation />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </Suspense>
        <Footer />
        <BackToTop />
      </Router>
    </ThemeProvider>
  );
}

export default App;
