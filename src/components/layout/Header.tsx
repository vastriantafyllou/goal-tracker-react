import { Link, useLocation } from "react-router";
import { Moon, Sun, Target, Home, ListChecks, Users, Folders } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/schemas/users";
import { AuthButton } from "@/components/AuthButton";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, userRole, username } = useAuth();
  const location = useLocation();

  const isAdmin = userRole === UserRole.Admin || userRole === UserRole.SuperAdmin;

  const navItems = [
    { name: "Home", path: "/", icon: Home, onlyWhenLoggedOut: true },
    { name: "Users", path: "/users", icon: Users, protected: true, adminOnly: true },
    { name: "Goals", path: "/goals", icon: ListChecks, protected: true },
    { name: "Categories", path: "/categories", icon: Folders, protected: true },
  ];

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 transition-transform group-hover:scale-105 shadow-lg">
                <Target className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                GoalTracker
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Achieve your goals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              if (item.adminOnly && !isAdmin) return null;
              if (item.onlyWhenLoggedOut && isAuthenticated) return null;
              const Icon = item.icon;
              
              // Hide Home button on HomePage but maintain space
              const isHomeButtonOnHomePage = item.path === "/" && location.pathname === "/";
              // Home button gets premium styling when visible
              const isHomeButton = item.path === "/";
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isHomeButtonOnHomePage 
                      ? "invisible pointer-events-none"
                      : isHomeButton
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm hover:shadow-md"
                      : isActivePath(item.path)
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  aria-hidden={isHomeButtonOnHomePage}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Theme Toggle + Auth */}
          <div className="flex items-center gap-2">
            {/* Welcome Message */}
            {isAuthenticated && username && (
              <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300 mr-1">
            {/* Welcome, */} <span className="font-semibold text-indigo-600 dark:text-indigo-400">{username}</span>
              </span>
            )}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              aria-label="Toggle theme"
              title={theme === "light" ? "Dark theme" : "Light theme"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" strokeWidth={2} />
              ) : (
                <Sun className="w-5 h-5 text-slate-300 group-hover:text-yellow-400 transition-colors" strokeWidth={2} />
              )}
            </button>
             <AuthButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            if (item.protected && !isAuthenticated) return null;
            if (item.adminOnly && !isAdmin) return null;
            if (item.onlyWhenLoggedOut && isAuthenticated) return null;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActivePath(item.path)
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;