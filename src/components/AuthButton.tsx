import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/hooks/useAuth.ts";
import {useNavigate, useLocation} from "react-router";
import {LogIn, LogOut} from "lucide-react";

export function AuthButton() {
  const { isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Login button when user is already on the login page
  const isOnLoginPage = location.pathname === "/login";

  const handleLogin = () => {
    navigate("/login");
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  }

  // If authenticated, always show Logout button
  if (isAuthenticated) {
    return (
      <Button
        onClick={handleLogout}
        className="w-30 h-9 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </Button>
    );
  }

  // If not authenticated and on login page, hide the button but maintain space
  if (isOnLoginPage) {
    return (
      <Button
        disabled
        className="w-30 h-9 text-base font-semibold invisible pointer-events-none"
        aria-hidden="true"
      >
        <LogIn className="w-5 h-5" /> Sign In
      </Button>
    );
  }

  // Otherwise, show Login button
  return (
    <Button
      onClick={handleLogin}
      className="w-30 h-9 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
    >
      <LogIn className="w-5 h-5" /> Sign In
    </Button>
  );
}