import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("ERROR: Login Failed");
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ width: 1280, height: 720 }}>

        {/* LEFT — SIGN IN */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign In</h2>

          {/* Social icons row (placeholders) */}
          <div className="flex gap-4 text-gray-600 mb-6 items-center justify-center">
            <span className="cursor-pointer">🐦</span>
            <span className="cursor-pointer">📘</span>
            <span className="cursor-pointer">📷</span>
            <span className="cursor-pointer">🔗</span>
          </div>

          <p className="text-gray-500 mb-4 text-sm">or use your email password</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring focus:ring-blue-300"
              required
            />

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring focus:ring-blue-300"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="text-sm text-gray-500 hover:underline block">
              Forget Your Password?
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "SIGN IN"}
            </button>
          </form>
        </div>

        {/* RIGHT — HELLO PANEL */}
        <div className="
        w-1/2 
        flex flex-col 
        items-center justify-center 
        text-white p-10 
        bg-linear-to-br from-cyan-600 to-teal-500
        rounded-l-[6rem]
      ">
          <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
          <p className="text-center text-lg mb-6 opacity-90">
            Register with your personal details to use all
            <br /> of site features
          </p>

          <Link
            to="/auth/signup"
            className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-cyan-600 transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};
