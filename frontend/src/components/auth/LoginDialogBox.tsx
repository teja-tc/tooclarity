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
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/user-store";
import ForgotPasswordDialogBox from "./ForgotPasswordDialogBox";

type LoginCaller = "admin" | "institution";

interface LoginDialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caller?: LoginCaller;
  onSuccess?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 488 512">
    <path
      fill="#4285F4"
      d="M488 261.8c0-17.7-1.6-35.3-4.7-52H249v98h134c-6 32-24.4 59-52 77l84 65c49-45 77-111 77-188z"
    />
    <path
      fill="#34A853"
      d="M249 492c70 0 129-23 172-62l-84-65c-23 15-52 24-88 24-68 0-125-46-146-107H17v67c43 86 132 143 232 143z"
    />
    <path
      fill="#FBBC05"
      d="M103 282c-5-15-8-30-8-46s3-31 8-46V123H17a243 243 0 0 0 0 266l86-67z"
    />
    <path
      fill="#EA4335"
      d="M249 97c38 0 72 13 98 39l74-74C378 23 319 0 249 0 149 0 60 57 17 141l86 67c21-61 78-107 146-107z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 23 23">
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#00a4ef" d="M12 1h10v10H12z" />
    <path fill="#7fba00" d="M1 12h10v10H1z" />
    <path fill="#ffb900" d="M12 12h10v10H12z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 384 512">
    <path
      fill="currentColor"
      d="M318.7 268c-.2-36.7 16-64.6 49-85.2-18.6-26.8-46.7-41.7-83.7-45-35.1-3.1-74 20.7-87.8 20.7-14.5 0-51.4-19.6-79.7-19.1-41 0-79.8 23.8-100.9 60.8-43.2 75-11.1 186 30.8 247 20.4 29.4 44.8 62.5 77 61 30.6-1.2 42.2-19.7 79.2-19.7 36.6 0 47 19.7 79.2 19.1 32.9-.5 53.6-29.5 73.7-58.9 22.9-33.5 32.3-66.1 32.6-67.8-1-.4-62.5-24-62.7-94.9zM251.1 79c15.6-18.9 26.2-45.1 23.3-71.5-22.4 1-49.4 15-65.4 33.9-14.3 17.1-27 44.7-23.6 70.8 25 .9 50.7-12.7 65.7-33.2z"
    />
  </svg>
);

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
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
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
        const user = useUserStore.getState().user;

        onOpenChange(false);
        setFormData({ email: "", password: "" });

        if (onSuccess) return onSuccess();

        if (user?.role === "INSTITUTE_ADMIN") {
          if (!user?.isProfileCompleted && !user?.isPaymentDone) router.push("/signup");
          else if (user?.isProfileCompleted && !user?.isPaymentDone) router.push("/payment");
          else router.push("/dashboard");
          return;
        }

        router.push("/");
      } else {
        setErrors({ general: "Invalid email or password. Please try again." });
      }
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "google" | "microsoft" | "apple") => {
    console.log(`Trigger ${provider} login`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold">Welcome Back!</DialogTitle>
            <DialogDescription>Sign in to your account</DialogDescription>
          </DialogHeader>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
              {errors.general}
            </div>
          )}

          <div className="grid gap-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              error={errors.email}
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
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

            <div className="text-right">
              <button
                onClick={() => {
                  onOpenChange(false);
                  setForgotPasswordOpen(true);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            <Button variant="outline" onClick={() => handleOAuthLogin("google")} className="w-full h-12 flex items-center justify-center gap-2">
              <GoogleIcon /> Continue with Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin("microsoft")} className="w-full h-12 flex items-center justify-center gap-2">
              <MicrosoftIcon /> Continue with Microsoft
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin("apple")} className="w-full h-12 flex items-center justify-center gap-2">
              <AppleIcon /> Continue with Apple
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <ForgotPasswordDialogBox
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </>
  );
}
