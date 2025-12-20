import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout(){
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <Header/>

      {/* CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-4">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer/>
    </div>
  );
}
