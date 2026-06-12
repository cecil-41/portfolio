import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import experiencesData from '../data/experiences.json';

interface Experience {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const Experience: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const experiences: Experience[] = experiencesData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-deep-950 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Professional Experience
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            A journey through roles that shaped my expertise and technical capabilities
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="space-y-6 relative z-10"
        >
          {experiences.map((exp, index) => (
            <motion.div key={exp.id} variants={itemVariants}>
              <motion.button
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="cursor-pointer w-full text-left"
              >
                <div className="group relative bg-white dark:bg-deep-800 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200/70 dark:border-purple-900/30 hover:border-purple-400/50 dark:hover:border-purple-500/40">
                  {/* Timeline Indicator */}
                  <div className="absolute -left-4 top-8 w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white dark:border-deep-950 shadow-glow" />

                  {/* Timeline Line */}
                  {index < experiences.length - 1 && (
                    <div className="absolute -left-[14px] top-16 w-1 h-24 bg-linear-to-b from-purple-400 to-pink-500 opacity-50" />
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {exp.position}
                      </h3>
                      <p className="text-purple-400 dark:text-cyan-300 font-semibold mb-2">
                        {exp.company}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{exp.period}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-purple-400 dark:text-pink-500"
                    >
                      <ChevronDown size={24} />
                    </motion.div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm">
                    {exp.description}
                  </p>
                </div>
              </motion.button>

              {/* Expandable Content */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: expandedId === exp.id ? 1 : 0,
                  height: expandedId === exp.id ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-slate-50/80 dark:bg-deep-700/60 border border-t-0 border-slate-200/70 dark:border-purple-900/30 rounded-b-xl">
                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">Key Achievements</h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-300 text-sm">
                          <span className="text-purple-400 dark:text-pink-500 mt-1">▸</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="tag"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
