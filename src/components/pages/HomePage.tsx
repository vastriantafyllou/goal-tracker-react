import {useAuth} from "@/hooks/useAuth.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
import {Target, CheckCircle2, TrendingUp, ArrowRight, Sparkles, LogIn} from "lucide-react";
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
      description: "Create and organize your goals the easy way"
    },
    {
      icon: CheckCircle2,
      title: "Track Progress",
      description: "Monitor your progress in real-time"
    },
    {
      icon: TrendingUp,
      title: "Achieve Results",
      description: "Accomplish more with an organized approach"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Start your goal journey today
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
          Goal Tracker
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Manage and achieve your goals in an organized and effective way
        </p>
        
        {isAuthenticated ? (
          <Button 
            size="lg" 
            onClick={() => navigate("/goals")}
            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Target className="w-5 h-5 mr-2" />
            View Your Goals
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Register now!
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" /> Sign In
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 px-4 py-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
              <feature.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default HomePage;