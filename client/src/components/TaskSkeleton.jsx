import React from "react";

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm animate-pulse"
        >
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
          {i === 4 && <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full mt-4"></div>}
        </div>
      ))}
    </div>
  );
};

export const CardListSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
