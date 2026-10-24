import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

import LoadingM from "../../components/animations/LoadingM";
import LoadingMWhite from "../../components/animations/LoadingMwhite";

import BlueLogo from "../../assets/logoblue.svg";
import WhiteLogo from "../../assets/logowhite.svg";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // one-liner: are we in dark mode right now?
  const dark = document.documentElement.classList.contains("dark");

  /* --------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://s6-1cep.onrender.com/auth/google/login";
  };

 

  /* --------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10 relative">
      {/* logo */}
      <a href="/" className="absolute -top-6 left-4 flex items-center gap-2 select-none">
        {/* light logo */}
        <img
          src={BlueLogo}
          alt="JobMatch AI logo"
          className="h-36 w-36 md:h-36 md:w-36 dark:hidden"
        />
        {/* dark logo */}
        <img
          src={WhiteLogo}
          alt="JobMatch AI logo"
          className="h-36 w-36 md:h-36 md:w-36 hidden dark:block"
        />
      </a>

      {/* global spinner */}
      {loading && (dark ? <LoadingMWhite /> : <LoadingM />)}

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 flex flex-col"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Sign in
        </h1>

    {/* Google button */}
<button
  onClick={handleGoogleLogin}
  disabled={loading}
  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[50px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-60"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24"
    height="24"
    className="flex-shrink-0"
  >
    <path
      fill="#fbc02d"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
        c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039
        l5.657-5.657C34.046,6.053,29.268,4,24,4
        C12.955,4,4,12.955,4,24s8.955,20,20,20
        s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#e53935"
      d="M6.306,14.691l6.571,4.819
        C14.655,15.108,18.961,12,24,12
        c3.059,0,5.842,1.154,7.961,3.039
        l5.657-5.657C34.046,6.053,29.268,4,24,4
        C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4caf50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192
        l-6.19-5.238C29.211,35.091,26.715,36,24,36
        c-5.202,0-9.619-3.317-11.283-7.946
        l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1565c0"
      d="M43.611,20.083L43.595,20L42,20H24v8
        h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
        l6.19,5.238C36.971,39.205,44,34,44,24
        C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
  <span className="text-sm sm:text-base font-medium">Continue with Google</span>
</button>


        {/* separator */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </motion.div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
        New here?{" "}
        <a href="/signup" className="text-primary hover:underline font-semibold">
          Join now
        </a>
      </p>
    </div>
  );
}
