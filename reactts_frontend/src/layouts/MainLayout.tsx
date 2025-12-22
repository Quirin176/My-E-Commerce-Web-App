import Header from "../components/MainLayout/Header";
import Footer from "../components/MainLayout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col py-10">
      <Header />

      <main className="flex-1 flex flex-col container mx-auto px-4 py-4">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;
