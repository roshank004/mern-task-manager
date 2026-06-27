import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clipboard, AlignLeft, Calendar, BarChart2, Tag } from "lucide-react";

const TaskForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setPriority(initialData.priority || "Low");
      
      // Parse category and description
      const descText = initialData.description || "";
      const match = descText.match(/^\[(.*?)\]\s*(.*)/s);
      if (match) {
        setCategory(match[1]);
        setDescription(match[2]);
      } else {
        setCategory("General");
        setDescription(descText);
      }

      if (initialData.dueDate) {
        // format Date object or ISO string to YYYY-MM-DD for input type="date"
        const d = new Date(initialData.dueDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate("");
      }
    } else {
      // Clear fields for create mode
      setTitle("");
      setDescription("");
      setPriority("Low");
      setCategory("General");
      setDueDate("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Combine category into description metadata format
    const finalDescription = `[${category}] ${description.trim()}`;

    onSubmit({
      title: title.trim(),
      description: finalDescription,
      priority,
      dueDate: dueDate || null,
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Form Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {initialData ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clipboard className="w-3.5 h-3.5" />
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: null });
                  }}
                  className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    errors.title
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1 pl-1">{errors.title}</p>
                )}
              </div>

              {/* Description input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" />
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide more context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                />
              </div>

              {/* Priority & Category side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-50 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-2xl shadow-lg shadow-indigo-600/10 transition"
                >
                  {initialData ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;