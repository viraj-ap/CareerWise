import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <Navbar />
        <Container>
          <main className="flex-grow">
            <Outlet />
          </main>
        </Container>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
