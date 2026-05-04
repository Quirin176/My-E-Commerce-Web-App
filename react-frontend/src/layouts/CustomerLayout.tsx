import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/MainLayout/Customer/CustomerHeader";
import Footer from "../components/MainLayout/Customer/Footer";
import ChatBubble from "../components/ChatBubble";
import { siteConfig } from "../config/siteConfig";

export default function CustomerLayout() {
  const { colors } = siteConfig;

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: colors.backgroundcolor }}
    >

      <CustomerHeader />

      <main className="flex-1 flex flex-col container mx-auto p-4 overflow-x-hidden">
        <Outlet />
      </main>

      <Footer />
      <ChatBubble />
    </div>
  );
};
