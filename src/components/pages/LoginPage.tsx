import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {type LoginFields, loginSchema} from "@/schemas/login.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {Link, Navigate, useNavigate} from "react-router";
import {useAuth} from "@/hooks/useAuth.ts";
import { LogIn, User, Lock, Target } from "lucide-react";

export default function LoginPage(){
  const navigate = useNavigate();
  const { loginUser, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm <LoginFields>({
    resolver: zodResolver(loginSchema),
  })

  if (isAuthenticated) {
    return <Navigate to="/goals" replace />;
  }

  const onSubmit = async (data: LoginFields) => {
    try {
      await loginUser(data);
      toast.success("✨ Login successful!");
      navigate("/goals");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Login failed"
      );
    }
  }

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to continue to your goals
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6"
          autoComplete="off"
        >
          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">
              Username
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="username" 
                {...register("username")}
                className="pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Your username"
              />
            </div>
            {errors.username && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                ⚠️ {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
              Password
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                type="password" 
                id="password" 
                {...register("password")}
                className="pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            disabled={isSubmitting} 
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" /> Sign In
              </span>
            )}
          </Button>
          
          {/* Register Link */}
          <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>

        {/* Optional: Demo credentials hint */}
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            💡 New user? Create an account to get started!
          </p>
        </div>
      </div>
    </div>
  );
}