import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  type ResetPasswordFields,
  resetPasswordSchema,
} from "@/schemas/passwordRecovery.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import {
  validateResetToken,
  resetPassword,
  PasswordRecoveryError,
} from "@/services/api.passwordRecovery.ts";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  KeyRound,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

type TokenStatus = "validating" | "valid" | "invalid" | "expired";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("validating");
  const [tokenErrorMessage, setTokenErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenStatus("invalid");
        setTokenErrorMessage("No reset token provided. Please check your email link.");
        return;
      }

      try {
        const result = await validateResetToken(token);
        
        if (result.isValid) {
          setTokenStatus("valid");
        } else {
          setTokenStatus("invalid");
          setTokenErrorMessage(
            result.message || "This reset link is invalid or has expired."
          );
        }
      } catch (err) {
        setTokenStatus("invalid");
        
        if (err instanceof PasswordRecoveryError) {
          setTokenErrorMessage(err.message);
        } else {
          setTokenErrorMessage(
            err instanceof Error
              ? err.message
              : "Failed to validate reset token. Please try again."
          );
        }
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFields) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      await resetPassword(token, data.newPassword);
      
      setIsSuccess(true);
      toast.success("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err instanceof PasswordRecoveryError) {
        toast.error(err.message);
        
        if (err.statusCode === 400) {
          setTokenStatus("invalid");
          setTokenErrorMessage(err.message);
        }
      } else {
        toast.error(
          err instanceof Error ? err.message : "Failed to reset password"
        );
      }
    }
  };

  if (tokenStatus === "validating") {
    return (
      <div className="flex items-center justify-center py-8 px-4 min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Validating your reset link...
          </p>
        </div>
      </div>
    );
  }

  if (tokenStatus === "invalid" || tokenStatus === "expired") {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 mb-4 shadow-lg">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {tokenErrorMessage}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="space-y-4 text-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-2 text-red-800 dark:text-red-200 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-semibold mb-1">Common reasons:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>The link has expired (valid for 1 hour)</li>
                      <li>The link has already been used</li>
                      <li>The link was copied incorrectly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => navigate("/forgot-password")}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
                >
                  Request New Reset Link
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Password Reset Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Your password has been successfully reset.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="space-y-4 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  You can now log in with your new password.
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Redirecting to login page in 3 seconds...
              </p>

              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
              >
                Go to Login Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Reset Your Password
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter your new password below.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`pl-10 pr-10 h-11 ${
                    errors.newPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  {...register("newPassword")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Must be at least 12 characters with uppercase, lowercase, digit, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className={`pl-10 pr-10 h-11 ${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
              {!errors.confirmPassword && confirmPassword && newPassword && confirmPassword === newPassword && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
