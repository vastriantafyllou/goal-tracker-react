import {useAuth} from "@/hooks/useAuth.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
import {Target, CheckCircle2, TrendingUp, ArrowRight, Sparkles, LogIn, ChevronDown} from "lucide-react";
import { useEffect } from "react";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to goals page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/goals");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Target,
      title: "Set Goals",
    },
    {
      icon: CheckCircle2,
      title: "Track Progress",
    },
    {
      icon: TrendingUp,
      title: "Achieve Results",
    },
    {
      icon: Sparkles,
      title: "Stay Motivated",
    }
  ];

  return (
    <div className="relative w-full py-20 flex items-center justify-center overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Enhanced Background - Stronger for both themes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-[#0a0a0a]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6 shadow-sm backdrop-blur-sm border border-blue-100 dark:border-blue-800/50">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Start Your Journey Today
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 dark:from-blue-500 dark:via-sky-500 dark:to-cyan-500 bg-clip-text text-transparent leading-tight">
          Goal Tracker
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your ambitions into achievements with smart goal tracking and progress monitoring
        </p>
        
        {/* CTA Buttons - Enhanced shadows and hover effects */}
        {isAuthenticated ? (
          <Button 
            size="lg" 
            onClick={() => navigate("/goals")}
            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgb(37,99,235,0.4)] dark:shadow-[0_8px_30px_rgb(59,130,246,0.2)] dark:hover:shadow-[0_12px_40px_rgb(59,130,246,0.3)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 mb-10 animate-pulse-glow cursor-pointer"
          >
            <Target className="w-5 h-5 mr-2" />
            View Your Goals
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgb(37,99,235,0.4)] dark:shadow-[0_8px_30px_rgb(59,130,246,0.2)] dark:hover:shadow-[0_12px_40px_rgb(59,130,246,0.3)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 animate-pulse-glow cursor-pointer"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        )}

        {/* Feature Highlights - Horizontal with larger icons and micro-animations */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Subtle Scroll Indicator - Visual anchor */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce-slow">
        <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity">
          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400 -mt-3" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
export default HomePage;