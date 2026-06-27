import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const TaskCharts = ({ tasks }) => {
  // 1. Completion Data
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const completionData = [
    { name: "Completed", value: completedCount, color: "#10B981" }, // Emerald
    { name: "Pending", value: pendingCount, color: "#6366F1" }, // Indigo
  ];

  // Helper to extract category from description
  const getCategory = (description) => {
    const match = description?.match(/^\[(.*?)\]/);
    return match ? match[1] : "General";
  };

  // 2. Category Data
  const categoryCounts = tasks.reduce((acc, task) => {
    const cat = getCategory(task.description);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    tasks: categoryCounts[cat],
  }));

  const hasTasks = tasks.length > 0;

  if (!hasTasks) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Completion Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Task Completion Distribution
        </h3>
        <div className="h-[250px]">
          {completedCount === 0 && pendingCount === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              No tasks to analyze
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend iconType="circle" formatter={(value) => <span className="text-slate-600 dark:text-slate-300 text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Tasks by Category
        </h3>
        <div className="h-[250px]">
          {categoryData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              No categories mapped
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                />
                <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCharts;
