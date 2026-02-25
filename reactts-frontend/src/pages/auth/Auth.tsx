import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import type { SignupRequest } from "../../types/dto/SignupRequest";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Signup form state
  const [signupForm, setSignupForm] = useState<SignupRequest>({ username: "", email: "", phone: "", password: "", });
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  {/* ========== LOGIN HANDLER ========== */ }
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      toast.success("Login successful!");
      navigate("/");
    } catch (err: unknown) {
      console.error("Login error:", err);

      const axiosErr = err as AxiosError;

      const status = axiosErr?.response?.status;

      // console.log("Login error status:", status);

      if (status === 429) {
        const retryAfter = axiosErr?.response?.headers?.["retry-after"];
        const waitSec = retryAfter ? Number(retryAfter) : 60;

        setError(`Too many login attempts. Please wait ${waitSec} seconds.`);
        toast.error(`Too many attempts. Try again in ${waitSec} seconds.`);
      }
      else if (status === 401) {
        setError("Invalid email or password.");
        toast.error("Invalid email or password.");
      }
      else {
        setError("Login failed. Please try again later.");
        toast.error("Login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  {/* ========== SIGNUP HANDLER ========== */ }
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!signupForm.username || !signupForm.email || !signupForm.phone || !signupForm.password || !confirmPassword) {
      setError("Please fill in all fields!");
      return;
    }

    if (signupForm.password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(signupForm);
      if (success) {
        toast.success("Signup successful!");
        navigate("/auth?mode=login");
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);

      const axiosErr = err as AxiosError;

      const errorMsg = "Signup failed: " + (axiosErr?.message || "Unknown error");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  {/* ========== TOGGLE BETWEEN LOGIN/SIGNUP ========== */ }
  const toggleAuth = () => {
    setError("");
    setLoginEmail("");
    setLoginPassword("");
    setSignupForm({
      username: "",
      email: "",
      phone: "",
      password: "",
    });
    setConfirmPassword("");
    setIsLogin(!isLogin);
  };

  {/* ========== HANDLE SIGNUP FORM CHANGE ========== */ }
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: value
    }));
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

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
                  required
                />

                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 text-lg bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    {showLoginPassword ? (<Eye size={24} />) : (<EyeClosed size={24} />)}
                  </button>
                </div>

                <button className="text-sm text-gray-500 hover:underline block hover:text-gray-700 transition">
                  Forgot Your Password?
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "SIGN IN"}
                </button>
              </form>
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

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    User Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={signupForm.phone}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    placeholder="Create a password"
                    required
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
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
