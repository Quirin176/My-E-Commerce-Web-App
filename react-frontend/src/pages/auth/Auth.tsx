import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";
import SignupForm from "../../components/Auth/SignupForm";
// import "../../styles/authAnimations.css";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");

  function toggleAuth() {
    setIsLogin((prev) => !prev);
  }

  return (
    <div>
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

      <div className="auth-wrapper">
        {/* LOGIN CARD */}
        <div className={`card ${isLogin ? "login-card" : "login-card exit"}`}>
          <LoginForm onSwitch={toggleAuth} />
        </div>

        {/* SIGNUP CARD */}
        <div className={`card ${!isLogin ? "signup-card" : "signup-card exit"}`}>
          <SignupForm onSwitch={toggleAuth} />
        </div>
      </div>
    </div>
  );
}