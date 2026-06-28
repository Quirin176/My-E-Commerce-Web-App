import { Outlet } from "react-router-dom";
import AdminHeader from "../components/mainlayout/Admin/AdminHeader";
import AdminSidePanel from "../components/mainlayout/Admin/AdminSidePanel";
import Footer from "../components/mainlayout/Footer";

export default function AdminLayout() {

  return (
    <div className="flex min-h-screen">

      {/* Left Sidebar */}
      <AdminSidePanel />

      {/* Right Section */}
      <div className="flex flex-col flex-1 pl-60 transition-all duration-300 bg-(--bg-surface)">

        <AdminHeader />

        {/* Main Content */}
        <main className="flex-1 flex flex-col pt-18 overflow-hidden">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};
