import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Youtube } from 'lucide-react';
import { FaAws, FaDocker, FaPython, FaGitAlt, FaReact, FaNodeJs, FaBrain } from 'react-icons/fa';
import { SiKubernetes, SiTerraform, SiTypescript, SiPostgresql, SiJenkins } from 'react-icons/si';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Software Engineer';
  const typingSpeed = 100; // milliseconds per character
  const deletingSpeed = 50;
  const pauseDuration = 2000; // pause before deleting

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let isDeleting = false;
    let currentIndex = 0;

    const type = () => {
      if (!isDeleting && currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
        timeout = setTimeout(type, typingSpeed);
      } else if (!isDeleting && currentIndex > fullText.length) {
        timeout = setTimeout(() => {
          isDeleting = true;
          type();
        }, pauseDuration);
      } else if (isDeleting && currentIndex > 0) {
        currentIndex--;
        setTypedText(fullText.substring(0, currentIndex));
        timeout = setTimeout(type, deletingSpeed);
      } else if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        timeout = setTimeout(type, 500);
      }
    };

    type();

    return () => clearTimeout(timeout);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16">
      {/* Advanced 3D Tech Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-size-[50px_50px] dark:bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)]" />
        
        {/* Floating Tech Logos */}
        {[
          { Icon: FaAws, x: '15%', y: '20%', delay: 0, duration: 8, size: 48 },
          { Icon: FaDocker, x: '85%', y: '25%', delay: 1, duration: 10, size: 44 },
          { Icon: FaPython, x: '10%', y: '60%', delay: 2, duration: 9, size: 46 },
          { Icon: SiKubernetes, x: '80%', y: '70%', delay: 0.5, duration: 11, size: 44 },
          { Icon: FaGitAlt, x: '25%', y: '80%', delay: 1.5, duration: 7, size: 48 },
          { Icon: SiTerraform, x: '75%', y: '15%', delay: 2.5, duration: 12, size: 44 },
          { Icon: FaReact, x: '90%', y: '50%', delay: 1, duration: 8.5, size: 46 },
          { Icon: SiTypescript, x: '20%', y: '40%', delay: 0, duration: 10.5, size: 44 },
          { Icon: FaBrain, x: '70%', y: '85%', delay: 2, duration: 9.5, size: 46 },
          { Icon: FaNodeJs, x: '45%', y: '15%', delay: 1.5, duration: 11.5, size: 48 },
          { Icon: SiPostgresql, x: '5%', y: '45%', delay: 0.5, duration: 10, size: 44 },
          { Icon: SiJenkins, x: '95%', y: '60%', delay: 2, duration: 8, size: 46 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/40 dark:text-purple-400/60"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.4, 0.7, 0.4],
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <item.Icon size={item.size} />
          </motion.div>
        ))}
        
        {/* Animated Tech Icons/Symbols */}
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-purple-400/30 dark:border-purple-400/50"
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        <motion.div
          animate={{
            rotateX: [360, 0],
            rotateZ: [0, 360],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/4 w-16 h-16 border-2 border-cyan-300/30 dark:border-cyan-300/50"
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        {/* Neural Network Nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30">
          <motion.circle
            cx="20%" cy="30%" r="4"
            fill="url(#gradient1)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="80%" cy="40%" r="4"
            fill="url(#gradient2)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx="50%" cy="70%" r="4"
            fill="url(#gradient1)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />
          
          <motion.line
            x1="20%" y1="30%" x2="80%" y2="40%"
            stroke="url(#gradient1)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.line
            x1="80%" y1="40%" x2="50%" y2="70%"
            stroke="url(#gradient2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-cyan-300/20 to-purple-400/20 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-block px-4 py-2 bg-purple-400/10 border border-purple-400/30 rounded-full">
              <span className="text-purple-400 font-medium text-sm">Welcome to my portfolio</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display mb-6">
            <span className="bg-linear-to-r from-purple-400 via-pink-500 to-cyan-300 bg-clip-text text-transparent">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
            <br />
            <span className="text-slate-900 dark:text-slate-50">Crafting Excellence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            I build modern, scalable solutions with cutting-edge technologies. Specializing in full-stack development, AI integration, DevOps practices, and cloud architecture.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="cursor-pointer px-8 py-4 bg-linear-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
            >
              View My Projects
            </motion.button>
            <motion.a
              href="/portfolio/resume.pdf"
              download="Cecil_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-8 py-4 border-2 border-purple-400 text-purple-400 dark:text-cyan-300 rounded-lg font-semibold hover:bg-purple-400/10 transition-all duration-300 text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex gap-6 justify-center">
            {[
              { Icon: Github, label: 'GitHub', href: 'https://github.com/cecil-41' },
              { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/cecil-sithole-a596271b0/' },
              { Icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/channel/UCD1MViso0XFwCVrAFwc86Qg' },
              { Icon: Mail, label: 'Email', href: 'mailto:cecilbennett41@gmail.com' },
            ].map(({ Icon, label, href }) => (
              <motion.a
                key={label}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-400 dark:hover:text-pink-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Scroll to explore</span>
            <ArrowDown size={20} className="text-purple-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;