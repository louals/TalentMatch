import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiPieChart,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/logoblue.svg"

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  group?: string;
}

const navItems: NavItem[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: <FiHome size={18} />,
    group: "Overview",
  },
  {
    path: "/admin/users",
    label: "User Management",
    icon: <FiUsers size={18} />,
    group: "Management",
  },
  {
    path: "/admin/jobs",
    label: "Job Management",
    icon: <FiBriefcase size={18} />,
    group: "Management",
  },
  {
    path: "/admin/applications",
    label: "Applications",
    icon: <FiClipboard size={18} />,
    group: "Management",
  },
  {
    path: "/admin/cvs",
    label: "CV Management",
    icon: <FiFileText size={18} />,
    group: "Management",
  },
  {
    path: "/admin/analytics",
    label: "Analytics",
    icon: <FiPieChart size={18} />,
    group: "Reports",
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: <FiSettings size={18} />,
    group: "System",
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Group nav items by their group
  const groupedNavItems = navItems.reduce<Record<string, NavItem[]>>(
    (acc, item) => {
      const group = item.group || "Other";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {}
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className="
        hidden md:flex
        fixed top-0 left-0 h-screen w-64
        flex-col
        bg-white dark:bg-gray-950
        border-r border-gray-200 dark:border-gray-800
        shadow-lg
        text-gray-900 dark:text-white
        z-40
      "
    >
      {/* Logo / Branding */}
      <div
        className="
           font-bold text-2xl tracking-wide
          text-blue-600 dark:text-blue-400
          border-b border-gray-200 dark:border-gray-800
          flex items-center gap-2
          select-none
        "
      >
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          
            <img src={Logo} alt="" className="w-[130px] ml-14" />
          
          
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="
          flex-1 overflow-y-auto py-4 px-2
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
          dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900
        "
      >
        {Object.entries(groupedNavItems).map(([group, items]) => (
          <div key={group} className="mb-6 last:mb-0">
            <h3
              className="
                px-4 mb-2 text-xs font-semibold
                text-gray-500 dark:text-gray-400
                uppercase tracking-wider
                select-none
              "
            >
              {group}
            </h3>
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg mx-2
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div
        className="
          p-4 border-t border-gray-200 dark:border-gray-800
          bg-gray-50 dark:bg-gray-800/50
          flex flex-col gap-3
          select-none
        "
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {user?.first_name?.[0] || "A"}
            {user?.last_name?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "Admin User"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
            text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors duration-200
            font-semibold
          "
        >
          <FiLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
