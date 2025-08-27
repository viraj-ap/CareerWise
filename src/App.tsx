import { BrowserRouter as Router, Routes, Route } from "react-router";

import PublicLayout from "@/layouts/PublicLayout";
import HomePage from "@/pages/HomePage";

import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";

import ProtectedRoutes from "./layouts/ProtectedRoutes";
import MainLayout from "@/layouts/MainLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* authentication routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
        </Route>

        {/* protected routes */}
        <Route
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
