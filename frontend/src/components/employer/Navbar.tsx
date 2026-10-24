import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BlueLogo from "../../assets/logoblue.svg";
import WhiteLogo from "../../assets/logowhite.svg";

export default function EmployerNavbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  /* Helper for active link styling */
  const base = "text-sm font-semibold transition";
  const active = "text-primary dark:text-white";
  const idle = "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white";

  const cls = (path: string) =>
    `${base} ${location.pathname === path ? active : idle} block text-center`;

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 backdrop-blur-sm/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* logo */}
          <Link
  to={
    user?.role === "employer"
      ? "/employer/dashboard"
      : user?.role === "admin"
      ? "/admin/dashboard"
      : "/"
  }
  className="flex items-center space-x-3 select-none"
>
            <div className="relative h-24 w-24 md:h-36 md:w-36">
              <img
                src={BlueLogo}
                alt="JobMatch AI logo"
                className="absolute inset-0 h-full w-full object-contain dark:hidden"
              />
              <img
                src={WhiteLogo}
                alt="JobMatch AI logo"
                className="absolute inset-0 h-full w-full object-contain hidden dark:block"
              />
            </div>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={cls("/employer/jobs")}>
              Home
            </Link>
            <Link to="/employer/jobs" className={cls("/employer/jobs")}>
              My Jobs
            </Link>
            <Link to="/employer/jobs/new" className={cls("/employer/jobs/new")}>
              Post Job
            </Link>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Logout
            </button>
            <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>

          {/* mobile toggles */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-gray-950 px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col items-center space-y-3 w-full">
              <Link
                to="/employer/jobs"
                className={cls("/employer/jobs")}
                onClick={() => setIsOpen(false)}
              >
                My Jobs
              </Link>
              <Link
                to="/employer/jobs/new"
                className={cls("/employer/jobs/new")}
                onClick={() => setIsOpen(false)}
              >
                Post Job
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-red-600 hover:text-red-700 w-full text-center text-sm"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function DarkModeToggle({
  isDark,
  setIsDark,
}: {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}) {
  return (
    <motion.button
      onClick={() => setIsDark(!isDark)}
      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-indigo-400 transition"
      aria-label="Toggle dark mode"
      whileTap={{ rotate: 180, scale: 0.8 }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
}
