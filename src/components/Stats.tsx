import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Users, Coffee, Briefcase } from 'lucide-react';

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: Code2,
    value: 50,
    suffix: '+',
    label: 'Projects Completed',
    color: 'text-purple-400',
  },
  {
    icon: Users,
    value: 30,
    suffix: '+',
    label: 'Happy Clients',
    color: 'text-pink-500',
  },
  {
    icon: Coffee,
    value: 1500,
    suffix: '+',
    label: 'Cups of Coffee',
    color: 'text-cyan-300',
  },
  {
    icon: Briefcase,
    value: 5,
    suffix: '+',
    label: 'Years Experience',
    color: 'text-purple-400',
  },
];

const AnimatedCounter: React.FC<{ value: number; suffix: string; inView: boolean }> = ({
  value,
  suffix,
  inView,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, inView]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const Stats: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${
                      index % 2 === 0
                        ? 'from-purple-400/10 to-pink-500/10'
                        : 'from-cyan-300/10 to-purple-400/10'
                    } mb-4`}
                  >
                    <Icon size={32} className={stat.color} />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
