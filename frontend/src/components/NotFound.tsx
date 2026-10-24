import React from "react";
import { Link } from "react-router-dom";
import { FiFrown, FiHome, FiArrowRight } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto flex items-center justify-center">
            <FiFrown className="text-5xl text-blue-600 dark:text-blue-400" />
          </div>
          
        </div>

        {/* Main Message */}
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
          Page not found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <FiHome /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
