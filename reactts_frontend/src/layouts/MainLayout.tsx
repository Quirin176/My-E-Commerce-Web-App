import { ReactNode } from "react";
import Header from "../components/MainLayout/Header";
import Footer from "../components/MainLayout/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-4">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;
