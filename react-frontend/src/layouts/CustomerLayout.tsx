import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/MainLayout/Customer/CustomerHeader";
import Footer from "../components/MainLayout/Footer";
import { siteConfig } from "../config/siteConfig";

export default function CustomerLayout() {
  const { colors } = siteConfig;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.backgroundcolor }}
    >

      <CustomerHeader />

      <main className="flex-1 flex flex-col container mx-auto px-4 py-4 mt-20">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};
