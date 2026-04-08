import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(formData);
      navigate("/profile");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-200">Sign in</h2>
        <p className="text-gray-400 mt-2">Use your account to join and manage events.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#1e293b] border border-gray-800 rounded-2xl p-8">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
        >
          Sign in
        </button>

        {status && <p className="text-sm text-center text-red-400">{status}</p>}

        <p className="text-sm text-gray-400 text-center">
          Need an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;