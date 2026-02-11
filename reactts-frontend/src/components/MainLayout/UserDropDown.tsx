import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"
import { User2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function UserDropDown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleClick = (item: string) => {
    if (item === "My Acount") {
      navigate("/profile")
    }

    if (item === "My Orders" && user?.role === "Customer") {
      navigate("/orders")
    }

    if (item === "Orders" && user?.role === "Admin") {
      navigate("admin/orders")
    }

    if (item === "Logout") {
      logout();
      toast.success("Logged out successfully!");
      navigate("/");
    }

    setOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-start text-white cursor-pointer"
      >
        <div className="flex flex-row">
          <User2 size={55} strokeWidth={1.25} className="text-white cursor-pointer" />

          <div className="flex flex-col">
            <span className="text-lg">Welcome,</span>
            <span className="text-lg font-semibold">{user?.username}</span>
          </div>
        </div>
      </button>

      {/* DROP DOWN PANEL */}
      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            to={"/profile"}
            onClick={() => handleClick("My Account")}
            className="block px-3 py-2 rounded hover:text-white hover:font-bold hover:bg-black"
          >
            My Account
          </Link>

          {user?.role === "Customer" && (
            <Link
              to={"/orders"}
              onClick={() => handleClick("My Orders")}
              className="block px-3 py-2 rounded hover:text-white hover:font-bold hover:bg-black"
            >
              My Orders
            </Link>)}

          {user?.role === "Admin" && (
            <Link
              to={"/admin/orders"}
              onClick={() => handleClick("Orders")}
              className="block px-3 py-2 rounded hover:text-white hover:font-bold hover:bg-black"
            >
              Orders
            </Link>)}

          <Link
            to={"/profile"}
            onClick={() => handleClick("Logout")}
            className="block px-3 py-2 rounded hover:text-white hover:font-bold hover:bg-black"
          >
            Log Out
          </Link>
        </div>
      )}
    </div>
  );
}
