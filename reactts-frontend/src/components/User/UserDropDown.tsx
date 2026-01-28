import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"
import { User2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function UserDropDown({
  dropdown = ["My Account", "My Orders", "Logout"],
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleClick = (item: string) => {
    if (item === "Logout") {
      logout();
      toast.success("Logged out successfully!");
      navigate("/");
    }
    if (item === "My Acount") {
      navigate("/profile")
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

  return (
    <div className="relative flex items-center gap-2">
      <User2 size={50} strokeWidth={1.25} className="text-white cursor-pointer" />
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-start text-white cursor-pointer"
      >
        <span className="text-lg">Welcome,</span>
        <span className="text-lg font-semibold">{user?.username}</span>
      </button>

      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {dropdown.map((item, index) => (
            <div key={index}>
              {item === "Log out" ? (
                <button
                  onClick={() => handleClick(item)}
                  className="w-full text-left px-3 py-2 rounded hover:text-white hover:font-bold hover:bg-black"
                >
                  {item}
                </button>
              ) : (
                <Link
                  to={getLink(item)}
                  onClick={() => handleClick(item)}
                  className="block px-3 py-2 rounded hover:text-white hover:font-bold hover:bg-black"
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
