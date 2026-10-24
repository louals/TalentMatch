/* ---------- Navbar.tsx (mobile links centered, login button centered) ---------- */
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BlueLogo from "../../assets/logoblue.svg";
import WhiteLogo from "../../assets/logowhite.svg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  /* Dark mode class toggle */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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

          {/* desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks user={user} logout={logout} currentPath={location.pathname} />
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

      {/* mobile menu (drop + centered) */}
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
            <NavLinks
              user={user}
              logout={logout}
              currentPath={location.pathname}
              mobile
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ---------- helper: nav links ---------- */
function NavLinks({
  user,
  logout,
  currentPath,
  mobile = false,
}: {
  user: any;
  logout: () => void;
  currentPath: string;
  mobile?: boolean;
}) {
  const base = "text-sm font-semibold transition";
  const active = "text-primary dark:text-white";
  const idle =
    "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white";

  const cls = (path: string) =>
    `${base} ${currentPath === path ? active : idle} ${
      mobile ? "block text-center" : ""
    }`;

  const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    mobile ? (
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="w-full flex justify-center"
      >
        {children}
      </motion.div>
    ) : (
      <motion.span whileHover={{ y: -2 }} className="inline-block">
        {children}
      </motion.span>
    );

  
  let links: any[] = [];

  if (!user) {
    links = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
    ];
  } else if (user.role === "candidate") {
    links = [
      { to: "/", label: "Home" },
      { to: "/upload", label: "Upload CV" },
      { to: "/jobs", label: "Browse Jobs" },
      { to: "/matches", label: "My Matches" },
      { to: "/applications", label: "My Applications" },
    ];
  } else if (user.role === "employer") {
    links = [
      { to: "/employer/dashboard", label: "Dashboard" },
      { to: "/employer/jobs", label: "Manage Jobs" },
    ];
  } else if (user.role === "admin") {
    links = [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/users", label: "Users" },
    ];
  }

  return (
    <div
      className={
        mobile
          ? "flex flex-col items-center space-y-3 w-full"
          : "flex items-center space-x-6"
      }
    >
      {links.map(({ to, label }) => (
        <Wrap key={to}>
          <Link to={to} className={cls(to)}>
            {label}
          </Link>
        </Wrap>
      ))}

      {user ? (
        <Wrap>
          <button
            onClick={logout}
            className={`${base} text-red-600 hover:text-red-700 ${
              mobile && "w-full text-center"
            }`}
          >
            Logout
          </button>
        </Wrap>
      ) : (
        <>
          <Wrap>
            <Link
              to="/login"
              className={`px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded shadow text-sm ${
                mobile ? "text-center w-full" : ""
              }`}
            >
              Login
            </Link>
          </Wrap>
          <Wrap>
            <Link
              to="/signup"
              className={`px-4 py-2 bg-white dark:bg-primary/20 border border-primary dark:text-white text-primary hover:bg-primary/10 dark:hover:bg-gray-800 rounded shadow text-sm ${
                mobile ? "text-center w-full" : ""
              }`}
            >
              Join Now
            </Link>
          </Wrap>
        </>
      )}
    </div>
  );
}


/* ---------- helper: dark‑mode toggle ---------- */
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
