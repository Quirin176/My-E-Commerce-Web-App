import { useState } from "react";
import { Link } from "react-router-dom";
import { User2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function UserDropDown({
  dropdown = ["My Account", "My Orders", "Logout"],
}) {
  const [open, setOpen] = useState(false);
  const handleClick = (item: string) => {
    if (item === "Log out") {
      logout();
    }
    setOpen(false);
  };

  const getLink = (label: string) => {
    switch (label) {
      case "My Account":
        return "/profile";
      case "My Orders":
        return "/orders";
      default:
        return "#";
    }
  };

  const { user, logout } = useAuth();

  return (
    <div className="flex flex-column items-center">
      
      <User2 className="text-white cursor-pointer" />

      <div className="relative inline-block font-semibold">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white cursor-pointer"
        >
          <span className="text-lg text-white font-semibold underline">
            Welcome, {user?.username}
          </span>
        </button>

        {open && (
          <div
            className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50"
            onMouseLeave={() => setOpen(false)}
          >
            {dropdown.map((item, index) => (
              <div key={index}>
                {item === "Log out" ? (
                  <button
                    onClick={() => handleClick(item)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray"
                  >
                    {item}
                  </button>
                ) : (
                  <Link
                    to={getLink(item)}
                    onClick={() => handleClick(item)}
                    className="block px-3 py-2 rounded hover:bg-gray"
                  >
                    {item}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
