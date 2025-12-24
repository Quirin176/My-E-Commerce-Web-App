import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup form state
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Handlers
  const handleSignupChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const ok = await signup(form);
      if (ok) navigate("/home");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* 🟦 Sliding Container */}
        <div
          className={`flex transition-all duration-700 ease-in-out ${
            mode === "signup" ? "translate-x-1/2" : "translate-x-0"
          }`}
          style={{ width: "100%" }}
        >
          {/* ------------------ LOGIN FORM ------------------ */}
          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={submitLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="text-sm text-gray-500 hover:underline">
                Forgot Password?
              </button>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700"
              >
                SIGN IN
              </button>
            </form>

            <p className="mt-6 text-center">
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-teal-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* ------------------ SIGNUP FORM ------------------ */}
          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center mb-6">
              Create an Account
            </h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={submitSignup} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={handleSignupChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={handleSignupChange}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={handleSignupChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={handleSignupChange}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full bg-gray-100 rounded-lg px-4 py-3"
                onChange={handleSignupChange}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                SIGN UP
              </button>
            </form>

            <p className="mt-6 text-center">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* ------------------ INSTRUCTION PANEL ------------------ */}
        <div
          className={`
            absolute top-0 h-full w-1/2
            flex flex-col items-center justify-center text-white p-10
            bg-linear-to-br from-cyan-600 to-teal-500
            transition-all duration-700 ease-in-out
            ${mode === "signup" ? "translate-x-full rounded-l-[6rem]" : "translate-x-0 rounded-r-[6rem]"}
          `}
        >
          <h2 className="text-4xl font-bold mb-4">
            {mode === "signup" ? "Welcome Back!" : "Hello, Friend!"}
          </h2>

          <p className="text-lg text-center opacity-90">
            {mode === "signup"
              ? "Enter your details to start using the application."
              : "Register now to enjoy all features."}
          </p>
        </div>
      </div>
    </div>
  );
}
