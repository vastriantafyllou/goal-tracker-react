import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  type ForgotPasswordFields,
  forgotPasswordSchema,
} from "@/schemas/passwordRecovery.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import {
  sendRecoveryEmail,
  PasswordRecoveryError,
} from "@/services/api.passwordRecovery.ts";
import { Mail, KeyRound, ArrowLeft, CheckCircle2, Clock, Shield } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Recaptcha, { type RecaptchaRef } from "@/components/Recaptcha.tsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaRef>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (rateLimitSeconds > 0) {
      const timer = setInterval(() => {
        setRateLimitSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [rateLimitSeconds]);

  const onSubmit = useCallback(async (data: ForgotPasswordFields) => {
    try {
      let token = captchaToken;

      if (!token) {
        token = await recaptchaRef.current?.execute() || null;
        
        if (!token) {
          toast.error("Please complete the reCAPTCHA verification");
          return;
        }
      }

      await sendRecoveryEmail(data.email, token);

      setIsSuccess(true);
      toast.success("Email sent! Check your inbox.");

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);

      if (err instanceof PasswordRecoveryError) {
        if (err.statusCode === 429) {
          const retryAfter = err.rateLimitRetryAfter || 60;
          setRateLimitSeconds(retryAfter);
          toast.error(`Too many requests. Please wait ${retryAfter} seconds.`);
        } else if (err.statusCode === 400 && err.message.toLowerCase().includes("captcha")) {
          toast.error("reCAPTCHA verification failed. Please try again.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error(
          err instanceof Error ? err.message : "Failed to send recovery email"
        );
      }
    }
  }, [captchaToken, navigate]);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
    toast.warning("reCAPTCHA expired. Please verify again.");
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    toast.error("reCAPTCHA error. Please refresh and try again.");
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Check Your Email
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              If an account exists with that email, we've sent password reset
              instructions.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="space-y-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Security Notice:</strong> For your security, we never
                  reveal whether an email is registered in our system.
                </p>
              </div>

              <div className="text-left text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p className="font-semibold">What's next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your email inbox and spam folder</li>
                  <li>Click the reset link within 1 hour</li>
                  <li>Create a new password</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>
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
            Forgot Password?
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          {/* eslint-disable-next-line react-hooks/refs */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`pl-10 h-11 ${
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  {...register("email")}
                  disabled={isSubmitting || rateLimitSeconds > 0}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {rateLimitSeconds > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Clock className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    Too many attempts. Please wait {rateLimitSeconds} seconds.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Security Verification
                </Label>
              </div>
              <Recaptcha
                ref={recaptchaRef}
                onVerify={handleCaptchaVerify}
                onExpired={handleCaptchaExpired}
                onError={handleCaptchaError}
                size="normal"
                theme="light"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || rateLimitSeconds > 0}
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Sending...</span>
                </>
              ) : rateLimitSeconds > 0 ? (
                <>Wait {rateLimitSeconds}s</>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
