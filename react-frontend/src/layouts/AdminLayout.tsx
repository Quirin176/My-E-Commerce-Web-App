import { Outlet } from "react-router-dom";
import AdminHeader from "../components/MainLayout/Admin/AdminHeader";
import AdminSidePanel from "../components/MainLayout/Admin/AdminSidePanel";
import { siteConfig } from "../config/siteConfig";

export default function AdminLayout() {

  return (
    <div className="flex min-h-screen">

      {/* Left Sidebar */}
      <AdminSidePanel />

      {/* Right Section */}
      <div className="flex flex-col flex-1 ml-56 transition-all duration-300" style={{ backgroundColor: siteConfig.colors.backgroundcolor }}>
        {/* Top Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="flex-1 container mx-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
