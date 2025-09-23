"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import InputField from "@/components/ui/InputField";
import { useAuth } from "../../lib/auth-context";
import { useUserStore } from "@/lib/user-store";

type LoginCaller = "admin" | "institution";

export default function LoginDialogBox({ caller = "institution", onSuccess }: { caller?: LoginCaller; onSuccess?: () => void }) {
  const router = useRouter();
  const { login, refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const success = await login(formData.email, formData.password, caller);

      if (success) {
        // Ensure we have the latest user profile in store
        await refreshUser();

        // Read fresh snapshot from Zustand store (avoid stale closure)
        const latestUser = useUserStore.getState().user;
        console.log("[Login] Zustand user after login:", latestUser);

        // Close dialog and reset form
        setOpen(false);
        setFormData({ email: "", password: "" });

        // If parent provided a success handler (e.g., admin-login), use it
        if (onSuccess) {
          onSuccess();
          return;
        }

        // Decide destination based on role and flags
        const role = latestUser?.role;
        const isPaymentDone = !!latestUser?.isPaymentDone;
        const isProfileCompleted = !!latestUser?.isProfileCompleted;
        console.log("[Login] Flags:", { role, isPaymentDone, isProfileCompleted });

        if (role === "INSTITUTE_ADMIN") {
          if (!isPaymentDone && !isProfileCompleted) {
            router.push("/signup");
            return;
          }
          if (!isPaymentDone && isProfileCompleted) {
            router.push("/payment");
            return;
          }
          if (isPaymentDone && isProfileCompleted) {
            router.push("/dashboard");
            return;
          }
        }

        // Fallback
        router.push("/");
      } else {
        setErrors({ general: "Invalid email or password. Please try again." });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // This would typically integrate with Google OAuth
    // For now, showing placeholder
    alert("Google login integration would go here");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="login" size="lg">
          Log In
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-lg flex flex-col justify-between scrollbar-hide"
        overlayClassName="bg-black/50"
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="max-w-xs font-montserrat font-bold text-xl sm:text-[24px] leading-tight text-center">
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="max-w-xs font-montserrat font-normal text-sm sm:text-[14px] leading-relaxed text-center">
            Please sign in to your account
          </DialogDescription>
        </DialogHeader>

        <div className="grid flex-1">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          {/* Email Field */}
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required={true}
            error={errors.email}
          />

          {/* Password Field */}
          <div className="relative">
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={true}
              error={errors.password}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 sm:h-[48px] rounded-[12px] px-4 py-3 gap-2 font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center text-gray-500 mt-2">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}