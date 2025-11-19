import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type UserSignupFields, userSignupSchema } from "@/schemas/users.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { register as registerUser } from "@/services/api.users.ts";
import { UserPlus, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserSignupFields>({
    resolver: zodResolver(userSignupSchema),
  });

  const password = watch("password");
  const passwordsMatch = password === confirmPassword;

  const onSubmit = async (data: UserSignupFields) => {
    // Client-side validation for confirm password
    if (data.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser(data);
      toast.success("🎉 Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Start your goal journey today
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-5"
          autoComplete="off"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname" className="text-slate-700 dark:text-slate-300">
                First Name *
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="firstname" 
                  {...register("firstname")}
                  className="pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="John"
                />
              </div>
              {errors.firstname && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                  ⚠️ {errors.firstname.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="lastname" className="text-slate-700 dark:text-slate-300">
                Last Name *
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="lastname" 
                  {...register("lastname")}
                  className="pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="Doe"
                />
              </div>
              {errors.lastname && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                  ⚠️ {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">
              Username *
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="username" 
                {...register("username")}
                className="pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="username123"
              />
            </div>
            {errors.username && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                ⚠️ {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
              Email *
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                type="email" 
                id="email" 
                {...register("email")}
                className="pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="email@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
              Password *
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-start gap-1">
              💡 Must contain uppercase, lowercase, number and special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">
              Confirm Password *
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                type="password" 
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 ${
                  confirmPassword && (passwordsMatch ? 'border-green-500 dark:border-green-500' : 'border-red-500 dark:border-red-500')
                }`}
                placeholder="••••••••"
              />
              {confirmPassword && passwordsMatch && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                ⚠️ Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
                ✓ Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            disabled={isSubmitting || !passwordsMatch} 
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Register
              </span>
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
