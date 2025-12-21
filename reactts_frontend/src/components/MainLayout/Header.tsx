import { Link } from "react-router";
import { siteConfig } from "../../config/siteConfig";

const colors = siteConfig.colors;
const Header = () => {
  return (
    <header
      className="shadow-md"
      style={{ backgroundColor: colors.primarycolor }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              {siteConfig.webName}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
