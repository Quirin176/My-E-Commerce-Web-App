import { Link } from "react-router";
import { siteConfig } from "../../config/siteConfig";
import {useAuth} from "../../hooks/useAuth";
import UserDropDown from "../User/UserDropDown";

const colors = siteConfig.colors;
export default function Header() {
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-md px-8 py-1"
      style={{ backgroundColor: colors.primarycolor }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-6">

          {/* LOGO AND SITE NAME */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              {siteConfig.webName}
            </Link>
          </div>

          {/* NAVIGATION LINKS */}

          {/* USER */}
          {!user && (
          <div className="flex items-center">
            <Link
            to="/auth?mode=login"
            className="font-semibold text-white hover:text-black hover:bg-white rounded-0 border px-4 py-1"
            >
              Login
            </Link>
            <Link
            to="/auth?mode=signup"
            className="font-semibold text-white hover:text-black hover:bg-white rounded-0 border px-4 py-1"
            >
              Signup
            </Link>
          </div>)}

          {user && (
          <div className="flex items-center gap-3">
            <UserDropDown/>
            {/* <span className="text-white">Hello, {user.username}</span> */}
          </div>)}
        </div>
      </div>
    </header>
  );
};
