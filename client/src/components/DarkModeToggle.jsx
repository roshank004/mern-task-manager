import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden shadow-sm"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ y: darkMode ? 40 : 0, opacity: darkMode ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ y: darkMode ? 0 : -40, opacity: darkMode ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-indigo-400" />
      </motion.div>
    </button>
  );
};

export default DarkModeToggle;
