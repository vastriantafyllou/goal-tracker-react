import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdateFields, type UserReadOnly, UserRole } from "@/schemas/users";
import { getMyProfile, updateMyProfile } from "@/services/api.users";
import { User, Mail, AtSign, Save, Loader2, Shield, RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const { userId, userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserReadOnly | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateFields>({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must sign in first");
      navigate("/login");
      return;
    }
    loadProfile();
  }, [isAuthenticated, navigate]);

  const loadProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getMyProfile(parseInt(userId, 10));
      setProfileData(data);
      reset({
        username: data.username,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ProfileUpdateFields) => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const updated = await updateMyProfile(parseInt(userId, 10), values);
      setProfileData(updated);
      reset({
        username: updated.username,
        email: updated.email,
        firstname: updated.firstname,
        lastname: updated.lastname,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      SuperAdmin: {
        label: "Super Admin",
        className: "bg-purple-500/20 text-purple-100 border border-purple-400/30",
      },
      Admin: {
        label: "Admin",
        className: "bg-sky-500/20 text-sky-100 border border-sky-400/30",
      },
      User: {
        label: "User",
        className: "bg-white/20 text-white border border-white/30",
      },
    };
    return badges[role] ?? badges.User;
  };

  const initials = profileData
    ? `${profileData.firstname.charAt(0)}${profileData.lastname.charAt(0)}`.toUpperCase()
    : "??";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const badge = profileData ? getRoleBadge(profileData.userRole) : null;
  const isAdmin = userRole === UserRole.Admin || userRole === UserRole.SuperAdmin;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal account information
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Avatar banner */}
        <div className="bg-gradient-to-r from-blue-500 to-sky-600 px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">
                {profileData ? `${profileData.firstname} ${profileData.lastname}` : "—"}
              </h2>
              <p className="text-blue-100 text-sm truncate">@{profileData?.username}</p>
              {badge && (
                <span
                  className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}
                >
                  <Shield className="w-3 h-3" />
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First name */}
            <div className="space-y-2">
              <Label
                htmlFor="firstname"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="firstname"
                  {...register("firstname")}
                  className="pl-10"
                  placeholder="First name"
                />
              </div>
              {errors.firstname && (
                <p className="text-sm text-red-500">{errors.firstname.message}</p>
              )}
            </div>

            {/* Last name */}
            <div className="space-y-2">
              <Label
                htmlFor="lastname"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="lastname"
                  {...register("lastname")}
                  className="pl-10"
                  placeholder="Last name"
                />
              </div>
              {errors.lastname && (
                <p className="text-sm text-red-500">{errors.lastname.message}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Username
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="username"
                {...register("username")}
                className="pl-10"
                placeholder="Username"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="pl-10"
                placeholder="Email address"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Info note */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              Your role is managed by administrators and cannot be changed here.
            </p>
            {isAdmin && (
              <p className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                As an admin, you can also manage all users from the{" "}
                <button
                  type="button"
                  onClick={() => navigate("/users")}
                  className="underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  User Management
                </button>{" "}
                page.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                reset({
                  username: profileData?.username ?? "",
                  email: profileData?.email ?? "",
                  firstname: profileData?.firstname ?? "",
                  lastname: profileData?.lastname ?? "",
                })
              }
              disabled={!isDirty || isSubmitting}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
