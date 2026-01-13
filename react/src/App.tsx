import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import Home from "../components/Home";
import ChangePassword from "../components/ChangePassword";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import { useEffect, useState } from "react";
import { loadTheme } from "./theme";
import ThemeToggle from "../components/ThemeToggle";
import ErrorBoundary from "./context/ErrorBoundary";
import AdminRoute from "./routes/AdminRoute";
import Logout from "../components/Logout"
import { isAuthenticated } from "./utils/auth";

function App() {
    const [auth, setAuth] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const handler = () => setAuth(isAuthenticated());
    window.addEventListener("auth-changed", handler);

    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div style={{ textAlign: "right" }}>
          <ThemeToggle />
          {auth && <Logout />}
        </div>

        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />

          <Route
            path="/signup"
            element={
              <AuthLayout>
                <Signup />
              </AuthLayout>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ChangePassword />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
