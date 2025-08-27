import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="w-full h-screen overflow-hidden flex items center justify-center items-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout; 
