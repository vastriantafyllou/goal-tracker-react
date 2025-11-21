import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import Layout from "@/components/layout/Layout.tsx";
import HomePage from "@/components/pages/HomePage.tsx";
import LoginPage from "@/components/pages/LoginPage.tsx";
import RegisterPage from "@/components/pages/RegisterPage.tsx";
import GoalsPage from "@/components/pages/GoalsPage.tsx";
import GoalDetailsPage from "@/components/pages/GoalDetailsPage.tsx";
import CategoriesPage from "@/components/pages/CategoriesPage.tsx";
import UserManagementPage from "@/components/pages/UserManagementPage.tsx";
import PrivacyPolicyPage from "@/components/pages/PrivacyPolicyPage.tsx";
import TermsPage from "@/components/pages/TermsPage.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import {AuthProvider} from "@/context/AuthProvider.tsx";
import {ThemeProvider} from "@/context/ThemeProvider.tsx";
import {Toaster} from "sonner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              {/* Fix: Redirect old /dashboard → /goals */}
              <Route path="dashboard" element={<Navigate to="/goals" replace />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="goals">
                  <Route index element={<GoalsPage />} />
                  <Route path=":goalId" element={<GoalDetailsPage />} />
                  <Route path="new" element={<GoalDetailsPage />} />
                </Route>

                <Route path="categories">
                  <Route index element={<CategoriesPage />} />
                </Route>

                <Route path="users">
                  <Route index element={<UserManagementPage />} />
                </Route>
              </Route>
            </Route>

          </Routes>

          <Toaster richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
