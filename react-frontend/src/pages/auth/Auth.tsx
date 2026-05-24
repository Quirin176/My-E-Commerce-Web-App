import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState<boolean>(mode !== "signup");

  function toggleAuth() {
    const next = !isLogin;
    setIsLogin(next);
    navigate(`/auth?mode=${next ? "login" : "signup"}`, { replace: true });
  }

  return (
    <div className="flex items-center justify-center flex-1 py-28 bg-linear-to-r from-white to-blue-200">
      <div className="relative w-240 h-180 rounded-[3rem] overflow-hidden bg-white shadow-xl/30">
        {/* LOGIN CARD */}
        <div className={`
          absolute w-full h-full rounded-[3rem] overflow-hidden bg-white
          ${isLogin ? "animate-slide-in-left" : "animate-slide-out-right"}`}>
          <LoginForm onSwitch={toggleAuth} />
        </div>

        {/* SIGNUP CARD */}
        <div className={`
          absolute w-full h-full rounded-[3rem] overflow-hidden bg-white
          ${!isLogin ? "animate-slide-in-right" : "animate-slide-out-left"}`}>
          <SignupForm onSwitch={toggleAuth} />
        </div>
      </div>
    </div>
  );
}