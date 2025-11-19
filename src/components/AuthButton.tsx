import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/hooks/useAuth.ts";
import {useNavigate} from "react-router";
import {LogIn, LogOut} from "lucide-react";

export function AuthButton() {
  const { isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  }

  return isAuthenticated ? (
    <Button
      onClick={handleLogout}
      className="w-30 h-9 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
    >
      <LogOut className="w-5 h-5" /> Logout
    </Button>
  ) : (
    <Button
      onClick={handleLogin}
      className="w-30 h-9 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
    >
      <LogIn className="w-5 h-5" /> Login
    </Button>
  )
}