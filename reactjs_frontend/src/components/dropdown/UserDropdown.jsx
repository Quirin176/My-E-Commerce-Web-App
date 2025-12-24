import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown({categories = ["My Account", "My Orders", "Log out"], textColor = "", listhoverBg = ""}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const handleClick = (item) => {
    if (item === "Log out") {
      logout();
    }
    setOpen(false);
  };
  const getLink = (label) => {
    switch (label) {
      case "My Account":
        return "/profile";
      case "Orders":
        return "/orders";
      default:
        return "#";
    }
  };

  return (
    <div className="relative inline-block font-semibold">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 font-semibold"
        style={{color: textColor}}>
        <span className="text-lg text-white font-semibold underline">Welcome, {user.username}</span>
        </button>

      {/* DROPDOWN LIST */}
      {open && (
        <div
        className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50"
        onMouseLeave={() => setOpen(false)}>
          
          {categories.map((item, index) => (
            <div key={index}>
              {item === "Log out" ? (
                <button
                  onClick={() => handleClick(item)}
                  className={`w-full text-left px-3 py-2 rounded hover:${listhoverBg}`}
                >
                  {item}
                </button>
              ) : (
                <Link
                  to={getLink(item)}
                  onClick={() => handleClick(item)}
                  className={`block px-3 py-2 rounded hover:${listhoverBg}`}
                >
                  {item}
                </Link>
              )}
            </div>
          ))}
          </div>
      )}
    </div>
  );
}
