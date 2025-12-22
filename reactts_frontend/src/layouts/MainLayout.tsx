import { Outlet } from "react-router-dom";
import Header from "../components/MainLayout/Header";
import Footer from "../components/MainLayout/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col py-10">

      <Header/>

      {/* <main className="flex-1 flex flex-col container mx-auto px-4 py-4">
        <Outlet/>
      </main> */}

      <Footer/>

    </div>
  );
};
