import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import BlueLogo from "../../assets/logoblue.svg";
import WhiteLogo from "../../assets/logowhite.svg";
import { useEffect, useState } from "react";


export default function HeroSection() {
  const [isDark, setIsDark] = useState(false);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    controls.start({
      scale: [1, 1.03, 1],
      transition: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
    });
  }, [controls]);

  return (
    <section
      aria-label="MatchifAI - AI-powered job matching platform"
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
       
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto text-center flex flex-col items-center px-4 sm:px-6">
        {/* Logo with floating animation */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -5 }}
        >
          <img
            src={isDark ? WhiteLogo : BlueLogo}
            alt="MatchifAI"
            className="h-32 w-32 sm:h-40 sm:w-40 select-none"
          />
        </motion.div>

        {/* Headline with gradient text */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
            AI-Powered
          </span>{" "}
          <br className="sm:hidden" />
          Job Matching{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Reimagined</span>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-2 bg-primary/30 dark:bg-primary/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>
        </motion.h1>

        {/* Subheadline with typing animation effect */}
        <motion.p
          className="mt-6 sm:mt-8 max-w-2xl sm:max-w-3xl text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="relative after:content-[''] after:absolute after:right-[-8px] after:top-0 after:h-6 sm:after:h-7 after:w-[2px] after:bg-primary after:animate-blink">
            Stop searching. Start matching.
          </span>
        </motion.p>

        {/* Value proposition chips */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {["AI Matching", "Instant Results", "No Endless Scrolling", "Personalized Recommendations"].map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary dark:bg-white/10 dark:text-white/90"
            >
              {item}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons with hover animations */}
        <motion.div
          className="mt-8 sm:mt-12 w-full flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Link
            to="/upload"
            className="relative w-full sm:w-auto px-8 py-4 rounded-xl text-white bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 text-center font-medium text-sm sm:text-base group"
            aria-label="Upload your CV for AI matching"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="relative z-10">Get Matched Now</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ opacity: isHovered ? 1 : 0 }}
            />
          </Link>
          <Link
            to="/jobs"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-primary/30 dark:border-white/20 text-primary dark:text-white hover:bg-primary/5 dark:hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 text-center font-medium text-sm sm:text-base shadow-sm hover:shadow-md"
            aria-label="Browse available jobs"
          >
            Browse Jobs
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-8 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'wo' : ''}men/${i + 20}.jpg`}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                alt="Happy user"
              />
            ))}
          </div>
          <span>Trusted by 1,000+ job seekers</span>
        </motion.div>
      </div>

      {/* Scroll indicator with animated arrow */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}