import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogOut, BarChart3, Filter, LayoutGrid, CheckSquare } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import StatsCards from "../components/StatsCards";
import DarkModeToggle from "../components/DarkModeToggle";
import ConfirmationModal from "../components/ConfirmationModal";
import TaskCharts from "../components/TaskCharts";
import { StatsSkeleton, CardListSkeleton } from "../components/TaskSkeleton";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Task & UI States
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCharts, setShowCharts] = useState(true);

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Fetch Tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to load tasks.");
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract category from description
  const getCategory = (description) => {
    if (!description) return "General";
    const match = description.match(/^\[(.*?)\]/);
    return match ? match[1] : "General";
  };

  // Create or Update Task Submit
  const handleFormSubmit = async (formData) => {
    try {
      if (editingTask) {
        // Edit Mode
        const res = await api.put(`/tasks/${editingTask._id}`, {
          ...editingTask,
          ...formData,
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        toast.success("Task updated successfully!");
      } else {
        // Create Mode
        const res = await api.post("/tasks", {
          ...formData,
          completed: false,
        });
        setTasks((prev) => [res.data, ...prev]);
        toast.success("Task created successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save task."
      );
    } finally {
      setEditingTask(null);
    }
  };

  // Complete Task (Quick complete checkbox toggle)
  const completeTask = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, {
        ...task,
        completed: true,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
      toast.success("Task marked as completed!");
    } catch (error) {
      toast.error("Failed to complete task.");
    }
  };

  // Trigger Delete Confirmation Modal
  const triggerDelete = (id) => {
    setDeletingTaskId(id);
    setIsDeleteOpen(true);
  };

  // Delete Task Confirm
  const confirmDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      await api.delete(`/tasks/${deletingTaskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTaskId));
      toast.success("Task deleted.");
    } catch (error) {
      toast.error("Failed to delete task.");
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const category = getCategory(task.description);
    const matchesCategory = selectedCategory === "All" || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  useEffect(() => {
    fetchTasks();
  }, []);

  // Category tags options
  const categories = ["All", "Work", "Personal", "Shopping", "Fitness", "General"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans pb-12">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-150 dark:border-slate-800/80 z-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
              <span className="hidden sm:inline text-xs text-indigo-600 dark:text-indigo-400 font-semibold ml-2 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/30">
                Premium
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden md:inline text-sm font-semibold text-slate-700 dark:text-slate-350">
                {user?.name || "User"}
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            <DarkModeToggle />

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hello, {user?.name || "there"} 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here is your productivity brief for today.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition ${
                showCharts
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-750"
                  : "bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {showCharts ? "Hide Analytics" : "Show Analytics"}
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        {isLoading ? <StatsSkeleton /> : <StatsCards total={totalTasks} completed={completedTasks} pending={pendingTasks} />}

        {/* Analytics Section */}
        <AnimatePresence>
          {showCharts && !isLoading && <TaskCharts tasks={tasks} />}
        </AnimatePresence>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8 transition-colors duration-200">
          <div className="flex flex-col gap-6">
            <SearchBar search={search} setSearch={setSearch} />

            {/* Category selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-indigo-650 text-white shadow-md shadow-indigo-600/10"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-850"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task Grid Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-500" />
            Tasks List
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/30">
              {filteredTasks.length}
            </span>
          </h3>
        </div>

        {/* Tasks List / Grid */}
        {isLoading ? (
          <CardListSkeleton />
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-3xl text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm"
          >
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-full text-indigo-500 dark:text-indigo-400 mb-5">
              <CheckSquare className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              All Tasks Cleared!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              {search || selectedCategory !== "All"
                ? "No tasks match your current filters. Try resetting search or category filter."
                : "Your schedule is wide open. Enjoy the free time or add a new task to get started."}
            </p>
            <button
              onClick={() => {
                if (search || selectedCategory !== "All") {
                  setSearch("");
                  setSelectedCategory("All");
                } else {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }
              }}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition cursor-pointer"
            >
              {search || selectedCategory !== "All" ? "Reset Filters" : "Create Task"}
            </button>
          </motion.div>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  completeTask={completeTask}
                  deleteTask={triggerDelete}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setIsFormOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingTaskId(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
      />
    </div>
  );
};

export default Dashboard;