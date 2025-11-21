import { Link } from "react-router";
import { Heart, Target, Code2, Github } from "lucide-react";

const Footer = () => {
  const currentYear: number = new Date().getFullYear();
  
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-10 gap-6">
          {/* Brand & Description */}
          <div className="flex flex-col gap-3 max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-sm">
                <Target className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                GoalTracker
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Manage and achieve your goals in an easy and effective way.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
            {/* Navigation Links */}
            <div className="flex flex-wrap gap-6">
              <Link
                to="/privacy"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
            </div>
            
            {/* GitHub Link */}
            <a
              href="https://github.com/vastriantafyllou/goal-tracker-react"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:underline underline-offset-4 flex items-center gap-1.5"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span>© {currentYear} GoalTracker</span>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span className="flex items-center gap-1">
                Made with
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                by Vasilis
              </span>
            </div>

            {/* Tech Stack Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
              <Code2 className="w-3.5 h-3.5" />
              <span>React · TypeScript · Tailwind · .NET 8</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;