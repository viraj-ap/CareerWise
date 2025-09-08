import { BrowserRouter as Router, Routes, Route } from "react-router";

import PublicLayout from "@/layouts/PublicLayout";
import HomePage from "@/pages/HomePage";

import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";

import ProtectedRoutes from "@/layouts/ProtectedRoutes";
import MainLayout from "@/layouts/MainLayout";
import Generate from "@/components/Generate";
import Dashboard from "@/pages/Dashboard";
import CreateEditPage from "@/pages/CreateEditPage";
import { MockLoadPage } from "./pages/MockLoadPage";
import { MockInterviewPage } from "./pages/MockInterviewPage";

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
          <Route element={<Generate />} path="/generate">
            <Route index element={<Dashboard />} />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route
              path="interview/:interviewId/start"
              element={<MockInterviewPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
