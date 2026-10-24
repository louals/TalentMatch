import React from "react";
import { Outlet } from "react-router-dom";
import EmployerNavbar from "../components/employer/Navbar";

export default function EmployerLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Employer navbar at the top */}
      <EmployerNavbar />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
