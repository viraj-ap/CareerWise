import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <div className="w-full">
        {/* {handler to store the user data} */}
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
