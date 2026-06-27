import React from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, Trash2, Edit3, Check } from "lucide-react";

const TaskCard = ({ task, completeTask, deleteTask, onEdit }) => {
  // Parse category and description
  const parseDescription = (desc) => {
    if (!desc) return { category: "General", description: "" };
    const match = desc.match(/^\[(.*?)\]\s*(.*)/s);
    if (match) {
      return {
        category: match[1],
        description: match[2],
      };
    }
    return {
      category: "General",
      description: desc,
    };
  };

  const { category, description } = parseDescription(task.description);

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const createdDate = formatDate(task.createdAt);
  const dueDate = formatDate(task.dueDate);

  // Styling maps
  const priorityStyles = {
    High: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
    Medium: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
  };

  const categoryColors = {
    Work: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
    Personal: "bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400",
    Shopping: "bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400",
    Fitness: "bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400",
    General: "bg-slate-50 text-slate-600 dark:bg-slate-850 dark:text-slate-400",
  };

  const catBadgeStyle = categoryColors[category] || categoryColors.General;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm hover:shadow-md transition-shadow border-slate-100 dark:border-slate-800 ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <div>
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              priorityStyles[task.priority] || priorityStyles.Low
            }`}
          >
            {task.priority} Priority
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${catBadgeStyle}`}
          >
            <Tag className="w-3 h-3" />
            {category}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              task.completed
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>

        {/* Title + Checkbox */}
        <div className="flex items-start gap-3 mb-2">
          {/* Custom Checkbox */}
          <button
            onClick={() => completeTask(task)}
            disabled={task.completed}
            className={`mt-1 flex items-center justify-center w-5 h-5 rounded-md border text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              task.completed
                ? "bg-emerald-500 border-emerald-500 cursor-default"
                : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <h3
            className={`text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug break-all ${
              task.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className={`text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 break-all ${
            task.completed ? "text-slate-400 dark:text-slate-600" : ""
          }`}
        >
          {description || "No description provided."}
        </p>
      </div>

      {/* Dates & Actions */}
      <div className="border-t border-slate-50 dark:border-slate-800/80 pt-4 mt-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Dates */}
          <div className="space-y-1">
            {createdDate && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                Created: {createdDate}
              </span>
            )}
            {dueDate && (
              <span className="text-[11px] font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Due: {dueDate}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 justify-end">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 rounded-xl transition"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task._id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-xl transition"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;