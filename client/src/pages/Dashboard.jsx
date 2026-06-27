import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import StatsCards from "../components/StatsCards";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] =
    useState("Low");

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);

      if (
        error.response?.status === 401
      ) {
        logout();
      }
    }
  };

  // Create Task
  const createTask = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", {
        title,
        description,
        priority,
        completed: false,
      });

      setTitle("");
      setDescription("");
      setPriority("Low");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Complete Task
  const completeTask = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        ...task,
        completed: true,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Search Filter
  const filteredTasks = tasks.filter(
    (task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Stats
  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              Task Manager
            </h1>

            <p className="text-gray-500">
              Welcome, {user?.name} 👋
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">

        {/* Stats */}
        <StatsCards
          total={totalTasks}
          completed={completedTasks}
          pending={pendingTasks}
        />

        {/* Form */}
        <TaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          priority={priority}
          setPriority={setPriority}
          createTask={createTask}
        />

        {/* Search */}
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold">
              No Tasks Found
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first task.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                completeTask={completeTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;