import { Outlet } from "react-router-dom";
import AdminHeader from "../components/MainLayout/Admin/AdminHeader";
import Footer from "../components/MainLayout/Footer";
import AdminSidePanel from "../components/MainLayout/Admin/AdminSidePanel";
import { siteConfig } from "../config/siteConfig";

export default function AdminLayout() {
  const { colors } = siteConfig;

  return (
    <div className="flex min-h-screen">

      {/* Left Sidebar */}
      <AdminSidePanel />

      {/* Right Section */}
      <div className="flex flex-col flex-1 ml-16 transition-all duration-300" style={{ backgroundColor: colors.backgroundcolor }}>
        {/* Top Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6 mt-16">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
