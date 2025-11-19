import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 transition-colors">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;