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
} from "@/components/ui/dialog";
import InputField from "@/components/ui/InputField";
import { useAuth } from "../../lib/auth-context";
import { useUserStore } from "@/lib/user-store";

type LoginCaller = "admin" | "institution";

interface LoginDialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caller?: LoginCaller;
  onSuccess?: () => void;
}

export default function LoginDialogBox({
  open,
  onOpenChange,
  caller = "institution",
  onSuccess,
}: LoginDialogBoxProps) {
  const router = useRouter();
  const { login, refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

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
        await refreshUser();
        const latestUser = useUserStore.getState().user;

        // Close modal using parent control
        onOpenChange(false);

        setFormData({ email: "", password: "" });

        if (onSuccess) {
          onSuccess();
          return;
        }

        // Redirect logic
        const role = latestUser?.role;
        const isPaymentDone = !!latestUser?.isPaymentDone;
        const isProfileCompleted = !!latestUser?.isProfileCompleted;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg flex flex-col justify-between scrollbar-hide">
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="text-xl sm:text-[24px] font-bold">
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Please sign in to your account
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required={true}
            error={errors.email}
          />

          <div className="relative">
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
