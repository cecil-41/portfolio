import { ThemeProvider } from './hooks/useTheme';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import ScrollProgress from './components/ScrollProgress';
import Stats from './components/Stats';
import BackToTop from './components/BackToTop';
import Testimonials from './components/Testimonials';
import Qualifications from './components/Qualifications';

function App() {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <Navigation />
      <Hero />
      <Stats />
      <Skills />
      <Experience />
      <Qualifications />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
      <BackToTop />
    </ThemeProvider>
  );
}

export default App;
