import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const steps = [
  {
    title: "Upload Your CV",
    description: "Simply upload your CV—our AI extracts all the key details automatically in seconds.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m17 8-5-5-5 5" />
        <path d="M12 3v12" />
      </svg>
    ),
    delay: 0.1
  },
  {
    title: "AI Matching Magic",
    description: "Our advanced algorithm analyzes thousands of jobs to find your perfect matches with precision.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        <path d="M13 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
    ),
    delay: 0.3
  },
  {
    title: "Get Hired Faster",
    description: "One-click apply with AI-generated cover letters and real-time application tracking.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    delay: 0.5
  }
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      aria-label="How MatchifAI works"
      className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Modern background grid */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)]"></div>
      </div>
      
      {/* Floating accent shapes */}
      <div className="absolute -z-10 overflow-hidden inset-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary/5 opacity-30 animate-float blur-xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary/5 opacity-30 animate-float animation-delay-4000 blur-xl"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6 tracking-wide"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            SIMPLE 3-STEP PROCESS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Get matched to your{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative">
                <span className="text-primary">dream job</span>
                <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M0 10 Q 50 20 100 10 T 200 10" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    className="text-primary/50"
                  />
                </svg>
              </span>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Our AI does the heavy lifting so you can focus on what matters - landing interviews at your ideal companies.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(({ title, description, icon, delay }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                delay: delay, 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                y: -8,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  mass: 0.5
                }
              }}
              className="group relative"
            >
              {/* Border effect on hover */}
              <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 bg-primary/10 blur-sm transition-all duration-300"></div>
              
              <motion.div 
                className="relative h-full bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200/80 dark:border-gray-800/50 group-hover:border-transparent backdrop-blur-sm"
                whileHover={{
                  scale: 1.02,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
              >
                <div className="flex items-start">
                  {/* Icon container */}
                  <motion.div 
                    className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/5 mb-6"
                    whileHover={{
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 10
                      }
                    }}
                  >
                    <div className="relative z-10 text-primary">
                      {icon}
                    </div>
                  </motion.div>
                  
                  {/* Step number */}
                  <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-primary/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">
                    STEP {idx + 1}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{description}</p>
                
                {/* Learn more link */}
                <div className="mt-6">
                  <motion.a 
                    href="#" 
                    className="inline-flex items-center text-sm font-medium text-primary group-hover:underline transition-colors"
                    whileHover={{ 
                      x: 4,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 10
                      }
                    }}
                  >
                    Learn more
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Animated connector lines (for desktop) */}
        {isInView && (
          <div className="hidden md:flex justify-center items-center mt-12">
            {steps.map((_, idx) => (
              idx < steps.length - 1 && (
                <motion.div
                  key={idx}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    delay: 0.8 + idx * 0.2, 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="h-0.5 bg-primary/30 mx-4 flex-1 rounded-full"
                />
              )
            ))}
          </div>
        )}

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            delay: 1, 
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <motion.button 
              className="px-8 py-4 bg-primary text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(0, 57, 101, 0.4)",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }
              }}
              whileTap={{
                scale: 0.98
              }}
            >
              <span className="relative z-10">Get Started - It's Free</span>
            </motion.button>
            <motion.button 
              className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl shadow hover:shadow-md transition-all"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }
              }}
              whileTap={{
                scale: 0.98
              }}
            >
              <span className="relative z-10">See How It Works</span>
            </motion.button>
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            No credit card required. Get matched in minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}