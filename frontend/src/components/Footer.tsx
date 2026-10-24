import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const footerLinks = [
  { name: "Home", to: "/" },
  { name: "Jobs", to: "/jobs" },
  { name: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-primary text-primary dark:text-white py-8 px-6">
      <motion.div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Brand / Logo */}
        <div className="text-2xl font-extrabold tracking-wide">MatchifAI</div>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-wrap gap-6 text-sm sm:text-base">
            {footerLinks.map(({ name, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <div className="text-xs opacity-70">
          &copy; {new Date().getFullYear()} MatchifAI. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}
