import { Outlet } from "react-router-dom";
import AdminHeader from "../components/mainlayout/Admin/AdminHeader";
import AdminSidePanel from "../components/mainlayout/Admin/AdminSidePanel";
// import Footer from "../components/mainlayout/Footer";
import { siteConfig } from "../config/siteConfig";

export default function AdminLayout() {

  return (
    <div className="flex min-h-screen">

      {/* Left Sidebar */}
      <AdminSidePanel />

      {/* Right Section */}
      <div className="flex flex-col flex-1 ml-60 transition-all duration-300" style={{ backgroundColor: siteConfig.colors.backgroundcolor }}>
        {/* Top Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="flex-1" style={{ backgroundColor: siteConfig.colors.backgroundcolor }}>
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>
    </div>
  );
};
