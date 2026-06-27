import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Clock, Percent } from "lucide-react";

// Micro-counter animation component
const AnimatedCounter = ({ value }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
      transition={{ type: "spring", stiffness: 100 }}
      className="text-3xl font-bold text-slate-800 dark:text-slate-100"
    >
      {value}
    </motion.span>
  );
};

const StatsCards = ({ total, completed, pending }) => {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cardData = [
    {
      title: "Total Tasks",
      value: total,
      icon: <ClipboardList className="w-5 h-5 text-indigo-500" />,
      colorClass: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Completed",
      value: completed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      colorClass: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      colorClass: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    },
    {
      title: "Completion Rate",
      value: `${completionPercentage}%`,
      icon: <Percent className="w-5 h-5 text-blue-500" />,
      colorClass: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
      showProgress: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cardData.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl ${card.colorClass}`}>
              {card.icon}
            </div>
          </div>

          <div className="flex flex-col">
            <AnimatedCounter value={card.value} />

            {card.showProgress && (
              <div className="mt-3 w-full">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;