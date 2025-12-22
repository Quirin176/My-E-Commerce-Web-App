import { Link } from "react-router";
import { siteConfig } from "../../config/siteConfig";

const colors = siteConfig.colors;
const Header = () => {
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
          <div className="flex items-center gap-6">
            <Link to="/auth/login" className="text-white hover:underline">
              Login
            </Link>
            <Link to="/auth/signup" className="text-white hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
