import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
        email,
        password,
      });

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center bg-slate-950 overflow-hidden font-sans px-4">
      {/* Decorative Blur Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"
      />

      {/* Main Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-4 border border-emerald-500/20"
          >
            <UserPlus className="w-6 h-6" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign up to start tracking your tasks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full p-3 bg-slate-950 border rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                errors.name
                  ? "border-red-500/50 focus:ring-red-500"
                  : "border-slate-800 focus:ring-indigo-500"
              }`}
              required
            />
            {errors.name && (
              <p className="text-xs text-red-400 pl-1 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={`w-full p-3 bg-slate-950 border rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                errors.email
                  ? "border-red-500/50 focus:ring-red-500"
                  : "border-slate-800 focus:ring-indigo-500"
              }`}
              required
            />
            {errors.email && (
              <p className="text-xs text-red-400 pl-1 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                className={`w-full p-3 bg-slate-950 border rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent pr-12 transition ${
                  errors.password
                    ? "border-red-500/50 focus:ring-red-500"
                    : "border-slate-800 focus:ring-indigo-500"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 pl-1 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-600/50 text-white p-3.5 rounded-2xl font-semibold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;