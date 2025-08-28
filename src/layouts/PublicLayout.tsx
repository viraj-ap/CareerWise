import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthHandler from "@/handlers/AuthHandler";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <div className="w-full">
        <AuthHandler />
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
