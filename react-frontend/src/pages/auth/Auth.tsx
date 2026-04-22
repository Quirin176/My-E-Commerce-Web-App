import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";
import SignupForm from "../../components/Auth/SignupForm";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");

  function toggleAuth() {
    setIsLogin((prev) => !prev);
  }

  return (
    <div>
      <div className="relative w-full max-w-7xl h-180 mx-auto">
        {/* LOGIN CARD */}
        <div className={`
          absolute w-full h-full rounded-[3rem] overflow-hidden bg-white shadow-2xl
          ${isLogin ? "animate-slide-in-left" : "animate-slide-out-right"}`}>
          <LoginForm onSwitch={toggleAuth} />
        </div>

        {/* SIGNUP CARD */}
        <div className={`
          absolute w-full h-full rounded-[3rem] overflow-hidden bg-white shadow-2xl
          ${!isLogin ? "animate-slide-in-right" : "animate-slide-out-left"}`}>
          <SignupForm onSwitch={toggleAuth} />
        </div>
      </div>
    </div>
  );
}