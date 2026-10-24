import { Outlet, Navigate, useLocation } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  const { pathname } = useLocation();

  // Redirect /admin to /admin/dashboard
  if (pathname === "/admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      

      <div className="flex flex-1 pt-16"> {/* Add pt-16 to account for navbar height */}
        <Sidebar />

        {/* Main content area with left margin equal to sidebar width */}
        <main className="flex-1 ml-64 p-6 overflow-auto"> {/* ml-64 matches w-64 sidebar */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}