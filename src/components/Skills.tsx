import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Cloud, Palette } from 'lucide-react';
import skillsData from '../data/skills.json';

interface Skill {
  name: string;
  level: number;
  years: number;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
  color: string;
}

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    'Palette': <Palette size={24} />,
    'Code2': <Code2 size={24} />,
    'Database': <Database size={24} />,
    'Cloud': <Cloud size={24} />,
  };

  const skillCategories: SkillCategory[] = skillsData.map(category => ({
    ...category,
    icon: iconMap[category.icon] || <Code2 size={24} />,
  }));

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

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Technical Skills
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive suite of technologies and tools mastered over years of professional development
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          {skillCategories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(index)}
              className={`cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === index
                  ? `bg-gradient-to-r ${category.color} text-white shadow-glow`
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
              }`}
            >
              {category.icon}
              {category.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          {skillCategories[activeCategory].skills.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative bg-white dark:bg-slate-700 rounded-xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${skillCategories[activeCategory].color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{skill.name}</h3>
                  <span className="text-sm font-medium text-purple-400 dark:text-cyan-300">
                    {skill.years}y
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Proficiency</span>
                    <span className="text-sm font-semibold text-purple-400">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${skillCategories[activeCategory].color}`}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">Master-level expertise</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
