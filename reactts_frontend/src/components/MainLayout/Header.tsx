import { Link } from "react-router";
import { siteConfig } from "../../config/siteConfig";
import {useAuth} from "../../hooks/useAuth";
import UserDropDown from "../User/UserDropDown";

const colors = siteConfig.colors;
export default function Header() {
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-md"
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
          <div className="flex items-center gap-6">
            <Link to="/auth?mode=login" className="text-white hover:underline">
              Login
            </Link>
            <Link to="/auth?mode=signup" className="text-white hover:underline">
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
