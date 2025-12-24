import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      navigate("/");
      console.log("Login:", { email, password });
      toast.success("Login successful!");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Signup:", { username, email, phone, password });
      toast.success("Signup successful!");
    } catch (err) {
      setError("Signup failed: " + (err?.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuth = () => {
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
    setPhone("");
    setConfirmPassword("");
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4 overflow-hidden">
      <style>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutToRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }

        .login-card {
          animation: slideInFromLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .login-card.exit {
          animation: slideOutToRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .signup-card {
          animation: slideInFromRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .signup-card.exit {
          animation: slideOutToLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .container-wrapper {
          position: relative;
          width: 100%;
          max-width: 1280px;
          height: 720px;
        }

        .card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          background: white;
        }
      `}</style>

      <div className="container-wrapper">
        {/* LOGIN CARD */}
        <div className={`card ${isLogin ? 'login-card' : 'login-card exit'}`}>
          <div className="flex h-full">
            {/* LOGIN LEFT */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-8 text-gray-800">Sign In</h2>

              {/* Social icons */}
              <div className="flex gap-6 mb-8 items-center justify-center">
                <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">🐦</span>
                <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">📘</span>
                <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">📷</span>
                <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">🔗</span>
              </div>

              <p className="text-gray-500 mb-6 text-sm">or use your email password</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
                  required
                />

                <button className="text-sm text-gray-500 hover:underline block hover:text-gray-700 transition">
                  Forgot Your Password?
                </button>

                <button
                  onClick={handleLoginSubmit}
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "SIGN IN"}
                </button>
              </div>
            </div>

            {/* LOGIN RIGHT */}
            <div className="w-1/2 flex flex-col items-center justify-center text-white p-12 bg-linear-to-br from-cyan-600 to-teal-500 rounded-l-[3rem]">
              <h2 className="text-4xl font-bold mb-6">Hello, Friend!</h2>
              <p className="text-center text-lg mb-8 opacity-90">
                Don't have an account yet? Register with your personal details
              </p>

              <button
                onClick={toggleAuth}
                className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-cyan-600 active:scale-95 transition duration-300"
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>

        {/* SIGNUP CARD */}
        <div className={`card ${!isLogin ? 'signup-card' : 'signup-card exit'}`}>
          <div className="flex h-full">
            {/* SIGNUP LEFT */}
            <div className="w-1/2 flex flex-col items-center justify-center text-white p-12 bg-linear-to-br from-cyan-600 to-teal-500 rounded-r-[3rem]">
              <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
              <p className="text-center text-lg mb-8 opacity-90">
                Already have an account? Sign in to continue
              </p>

              <button
                onClick={toggleAuth}
                className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-cyan-600 active:scale-95 transition duration-300"
              >
                LOGIN
              </button>
            </div>

            {/* SIGNUP RIGHT */}
            <div className="w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Create an Account
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    User Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Confirm your password"
                  />
                </div>

                <button
                  onClick={handleSignupSubmit}
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
