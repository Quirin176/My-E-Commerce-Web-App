import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import toast from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    try {
      const success = await signup({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (success) {
        toast.success("Signup successful!");
        navigate("/home");
      } else {
        setError("Signup failed. Please check your details and try again.");
      }
    } catch (err) {
      setError("Signup failed: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">User Name</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;