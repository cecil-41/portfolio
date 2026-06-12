import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star, Linkedin } from 'lucide-react';
import testimonialsData from '../data/testimonials.json';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  linkedIn: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = testimonialsData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Fix slideVariants typing for framer-motion strictness
  const slideVariants: any = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'relative',
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute',
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-deep-900 relative overflow-hidden">
      <div className="absolute inset-0 line-grid" />
      
      {/* Floating Quote Icons */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 text-purple-400/10 dark:text-purple-400/20"
      >
        <Quote size={100} />
      </motion.div>
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 text-pink-500/10 dark:text-pink-500/20"
      >
        <Quote size={120} />
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 relative z-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-400 via-pink-500 to-cyan-300 bg-clip-text text-transparent">
              Client Testimonials
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8 sm:mb-0 pb-4 sm:pb-0">
            What people say about working with me
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative flex flex-col items-center mt-2 sm:mt-0">
            {/* Increased extra margin for mobile to prevent overlap */}
            <div className="h-1 block sm:hidden" />
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
                className="bg-white dark:bg-deep-800 border border-slate-200/60 dark:border-purple-900/30 rounded-3xl p-8 md:p-12 shadow-card-hover w-full z-20"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -1000) {
                    paginate(1);
                  } else if (swipe > 1000) {
                    paginate(-1);
                  }
                }}
              >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                  <Quote size={32} className="text-purple-500 dark:text-purple-400" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl text-center mb-8 leading-relaxed">
                "{currentTestimonial.content}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full mb-4 border-4 border-purple-400/30"
                />
                <h4 className="text-slate-900 dark:text-slate-100 font-bold text-lg text-center wrap-break-word">
                  {currentTestimonial.name}
                </h4>
                <p className="text-purple-400 font-medium text-center wrap-break-word whitespace-pre-line">
                  {currentTestimonial.role}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  {currentTestimonial.company}
                </p>
                <motion.a
                  href={currentTestimonial.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-linear-to-r from-purple-400 to-pink-500 hover:shadow-glow text-white transition-all duration-300"
                  aria-label={`View ${currentTestimonial.name}'s LinkedIn profile`}
                >
                  <Linkedin size={20} className="text-white" />
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8 z-30 relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="p-3 rounded-full bg-white dark:bg-deep-700 border border-slate-200/70 dark:border-purple-900/30 text-slate-600 dark:text-slate-300 hover:bg-purple-500 hover:border-purple-500 hover:text-white hover:shadow-glow transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-purple-500 w-8'
                      : 'bg-slate-300 dark:bg-deep-600 hover:bg-purple-400/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="p-3 rounded-full bg-white dark:bg-deep-700 border border-slate-200/70 dark:border-purple-900/30 text-slate-600 dark:text-slate-300 hover:bg-purple-500 hover:border-purple-500 hover:text-white hover:shadow-glow transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
