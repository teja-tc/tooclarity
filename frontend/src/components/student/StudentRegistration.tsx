"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Loader2, Smartphone, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { authAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/user-store";
import {
  GoogleCredentialResponse,
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  redirectToGoogleOAuth,
} from "@/lib/google-auth";

type OAuthProvider = {
  id: string;
  label: string;
  icon: string | LucideIcon;
};

interface StudentRegistrationProps {
  onSuccess?: () => Promise<void>;
}

const oauthProviders: OAuthProvider[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: "/google.png",
  },
];

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Handle success flow (same as login)
  const handleRegisterSuccess = async () => {
    await refreshUser();
    
    // Call the onSuccess prop if provided
    if (onSuccess) {
      await onSuccess();
    }
    
    const latestUser = useUserStore.getState().user;

    console.log("[Student Registration Route] Zustand user after signup:", latestUser);

    const role = latestUser?.role;
    const isPaymentDone = !!latestUser?.isPaymentDone;
    const isProfileCompleted = !!latestUser?.isProfileCompleted;

    console.log("[Student Registration Route] Flags:", { role, isPaymentDone, isProfileCompleted });

    if (role === "STUDENT") {
      if (!isProfileCompleted) {
        router.replace("/student/onboarding");
        return;
      }
      if (isProfileCompleted) {
        router.replace("/dashboard");
        return;
      }
    }
  };

  // Google script + identity init
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
              const response = await authAPI.googleAuth(credential);
              if (!response.success) {
                console.error("Google sign-up failed", response.message);
                return;
              }

              await handleRegisterSuccess();
            } catch (error) {
              console.error("Error sending Google token", error);
            } finally {
              setLoadingProvider(null);
            }
          },
        });

        if (isMounted) {
          setIsScriptLoaded(true);
        }
      } catch (error) {
        console.error("Failed to initialize Google Identity Services", error);
      }
    };

    void initialize();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
    const state = JSON.stringify({ state: "student", type: "register" });

    redirectToGoogleOAuth({
      clientId,
      redirectUri,
      userType: "student",
      state,
      type: "register",
    });
  };

  const renderedProviders = useMemo(
    () =>
      oauthProviders.map((provider) => {
        const isGoogle = provider.id === "google";
        const isLoading = loadingProvider === provider.id;
        const disableGoogleButton = isGoogle && !isScriptLoaded;

        if (typeof provider.icon === "function") {
          const Icon = provider.icon;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={isGoogle ? handleGoogleClick : undefined}
              disabled={disableGoogleButton}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
              </span>
              <span>{disableGoogleButton ? "Loading Google..." : provider.label}</span>
            </button>
          );
        }

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
            <span>{disableGoogleButton ? "Loading Google..." : provider.label}</span>
          </button>
        );
      }),
    [handleGoogleClick, isScriptLoaded, loadingProvider]
  );

  return (
    <section className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-blue-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-16">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center gap-3 text-blue-600">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1 transition hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </header>

        <div className="mb-8 flex flex-col items-center">
          <div className="grid place-items-center rounded-full p-6">
            <Image
              src="/Too Clarity.png"
              alt="Too Clarity Logo"
              width={120}
              height={60}
              priority
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Enter your phone number
          </h1>
          <p className="text-sm text-gray-500">
            We&apos;ll send you a text with a verification code.
          </p>
        </div>

        <form className="mt-6 space-y-6">
          <label className="block">
            <span className="sr-only">Mobile number</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Smartphone className="h-5 w-5" />
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="+91 Mobile number"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-base text-gray-900 outline-none transition hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled
            className="w-full rounded-2xl bg-gray-200 py-3 text-base font-semibold text-gray-500"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/student/login")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          <span>OR</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mt-6 space-y-3">{renderedProviders}</div>
      </div>
    </section>
  );
};

export default StudentRegistration;
