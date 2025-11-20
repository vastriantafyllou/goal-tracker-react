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
        {/* Radial gradient overlay for depth (stronger in dark) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,var(--tw-gradient-stops))]
 from-transparent via-slate-50/50 to-slate-100/80 dark:from-slate-900/50 dark:via-slate-900/70 dark:to-slate-950/90"></div>
        
        {/* Enhanced animated blobs - stronger opacity for light theme */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/30 dark:bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/35 dark:bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Additional right-side gradient for light theme vibrancy */}
        <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-purple-200/40 via-indigo-200/30 to-transparent dark:from-purple-900/20 dark:via-indigo-900/10 dark:to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-6 shadow-sm backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/50">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Start Your Journey Today
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
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
            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgb(79,70,229,0.4)] dark:shadow-[0_8px_30px_rgb(99,102,241,0.2)] dark:hover:shadow-[0_12px_40px_rgb(99,102,241,0.3)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 mb-10 animate-pulse-glow"
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
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgb(79,70,229,0.4)] dark:shadow-[0_8px_30px_rgb(99,102,241,0.2)] dark:hover:shadow-[0_12px_40px_rgb(99,102,241,0.3)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5"
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
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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