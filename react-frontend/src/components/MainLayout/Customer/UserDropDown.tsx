import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"
import { useAuth } from "../../../hooks/auth/useAuth";

export default function UserDropDown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative flex items-center gap-2">

      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-start text-white cursor-pointer"
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center cursor-pointer">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>

          <span className="text-lg font-bold">{user?.username}</span>
        </div>
      </button>

      {/* DROP DOWN PANEL */}
      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-42 border rounded-lg shadow-lg p-2 z-50 bg-(--bg-surface)"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            to={"/profile"}
            className="block w-full px-3 py-2 rounded font-medium hover:font-bold hover:text-(--text-primary) hover:bg-(--bg-muted)"
          >
            My Account
          </Link>

          {user?.role === "Customer" && (
            <Link
              to={"/orders"}
              className="block w-full px-3 py-2 rounded font-medium hover:font-bold hover:text-(--text-primary) hover:bg-(--bg-muted)"
            >
              My Orders
            </Link>)}

          {user?.role === "Admin" && (
            <Link
              to={"/admin/dashboard"}
              className="block w-full px-3 py-2 rounded font-medium hover:font-bold hover:text-(--text-primary) hover:bg-(--bg-muted)"
            >
              Admin Panel
            </Link>)}

          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
              toast.success("Logged out successfully!");
              navigate("/home");
              setOpen(false);
            }}
            className="block w-full px-3 py-2 rounded font-medium hover:font-bold hover:text-(--text-primary) hover:bg-(--bg-muted) text-start"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
