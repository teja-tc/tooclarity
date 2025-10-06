"use client";

import { useState,useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff ,Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { authAPI } from "@/lib/api";

import {
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  GoogleCredentialResponse,
  redirectToGoogleOAuth,
} from "@/lib/google-auth";

type LoginCaller = "admin" | "institution";

type OAuthProvider = {
  id: string;
  label: string;
  icon: string | LucideIcon;
};

const oauthProviders: OAuthProvider[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: "/google.png",
  },
//   {
//     id: "microsoft",
//     label: "Continue with Microsoft",
//     icon: "/window.svg",
//   },
//   {
//     id: "apple",
//     label: "Continue with Apple",
//     icon: Apple,
//   },
];

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

  // Google OAuth State
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // ✅ Initialize Google Identity
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
      return;
    }

    let isMounted = true;

    const initialize = async () => {
      const loaded = await loadGoogleIdentityScript();
      if (!loaded) {
        console.error("Failed to load Google Identity Services script");
        return;
      }

      try {
        initializeGoogleIdentity({
          clientId,
          autoSelect: false,
          uxMode: "redirect",
          callback: async ({ credential }: GoogleCredentialResponse) => {
            if (!credential) {
              setLoadingProvider(null);
              return;
            }

            try {
              // 🔹 Send credential to backend for institution login
              const response = await authAPI.googleAuth(credential);
              if (!response.success) {
                console.error("Google sign-in failed", response.message);
                return;
              }

              await refreshUser();
              const latestUser = useUserStore.getState().user;

              onOpenChange(false);

              if (onSuccess) {
                onSuccess();
                return;
              }

              // 🔹 Redirects based on institution user profile
              if (latestUser?.role === "INSTITUTE_ADMIN") {
                if (!latestUser.isPaymentDone && !latestUser.isProfileCompleted) {
                  router.push("/signup");
                  return;
                }
                if (!latestUser.isPaymentDone && latestUser.isProfileCompleted) {
                  router.push("/payment");
                  return;
                }
                if (latestUser.isPaymentDone && latestUser.isProfileCompleted) {
                  router.push("/dashboard");
                  return;
                }
              }

              router.push("/");
            } catch (error) {
              console.error("Error sending Google token", error);
            } finally {
              setLoadingProvider(null);
            }
          },
        });

        if (isMounted) setIsScriptLoaded(true);
      } catch (error) {
        console.error("Failed to initialize Google Identity Services", error);
      }
    };

    void initialize();
    return () => {
      isMounted = false;
    };
  }, [refreshUser, router, onOpenChange, onSuccess]);

  // ✅ Handle Google OAuth button click
  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
    const state = JSON.stringify({ state: "institution", type: "login" });

    redirectToGoogleOAuth({
      clientId,
      redirectUri,
      userType: "institution",
      state: state,
      type: "login",
    });
  };


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

  // ---- Render OAuth Providers ----
  const renderedProviders = useMemo(
    () =>
      oauthProviders.map((provider) => {
        const isGoogle = provider.id === "google";
        const isLoading = loadingProvider === provider.id;
        const disableGoogleButton = isGoogle && !isScriptLoaded;

        return (
          <button
            key={provider.id}
            type="button"
            onClick={isGoogle ? handleGoogleClick : undefined}
            disabled={disableGoogleButton}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Image
                  src={provider.icon as string}
                  alt={provider.label}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              )}
            </span>
            <span>
              {disableGoogleButton ? "Loading Google..." : provider.label}
            </span>
          </button>
        );
      }),
    [handleGoogleClick, isScriptLoaded, loadingProvider]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg flex flex-col justify-between scrollbar-hide"
      overlayClassName="bg-black/50"
      >
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
        

        {/* Google OAuth Section */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>OR</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="space-y-3">{renderedProviders}</div>
        


      </DialogContent>
    </Dialog>
  );
}
