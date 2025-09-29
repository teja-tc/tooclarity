// "use client";

// // Add global type augmentation for window.google
// declare global {
//   interface Window {
//     google?: {
//       accounts?: {
//         id?: {
//           initialize: (options: any) => void;
//           prompt: () => void;
//         };
//       };
//     };
//   }
// }

// import React, { useMemo, useState } from "react";
// import Image from "next/image";
// import {
//   ArrowLeft,
//   Apple,
//   Loader2,
//   Smartphone,
//   type LucideIcon,
// } from "lucide-react";
// import Script from "next/script";

// import { useRouter } from "next/navigation";

// import { authAPI } from "@/lib/api";
// import { useAuth } from "@/lib/auth-context";

// type OAuthProvider = {
//   id: string;
//   label: string;
//   icon: string | LucideIcon;
// };

// const oauthProviders: OAuthProvider[] = [
//   {
//     id: "google",
//     label: "Continue with Google",
//     icon: "/google.png",
//   },
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
// ];

// const StudentRegistration: React.FC = () => {
//   const router = useRouter();
//   const { refreshUser } = useAuth();

//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

//   const initializeGoogle = () => {
//     if (!window.google?.accounts?.id) {
//       return;
//     }

//     window.google.accounts.id.initialize({
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
//       callback: async (credentialResponse: any) => {
//         const token = credentialResponse.credential;
//         if (!token) {
//           setLoadingProvider(null);
//           return;
//         }

//         try {
//           const response = await authAPI.googleAuth(token);
//           if (!response.success) {
//             console.error("Google sign-in failed", response.message);
//             return;
//           }

//           await refreshUser();
//           router.replace("/student/dashboard");
//         } catch (error) {
//           console.error("Error sending Google token", error);
//         } finally {
//           setLoadingProvider(null);
//         }
//       },
//       ux_mode: "popup",
//       auto_select: false,
//     });
//   };

//   //   const handleGoogleClick = async () => {
//   //     if (!isScriptLoaded || typeof window === "undefined" || !window.google?.accounts?.id) {
//   //       console.error("Google Identity Services script not ready");
//   //       return;
//   //     }

//   //     setLoadingProvider("google");

//   //     window.google.accounts.id.prompt();
//   //   };

//   const handleGoogleClick = () => {
//     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
//     // const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!; // e.g., http://localhost:3000/api/auth/google/callback
//     const redirectUri = "http://localhost:3001/auth/google/callback";
//     const scope = encodeURIComponent("openid email profile");
//     const responseType = "code";

//     const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;

//     window.location.href = oauthUrl;
//   };

//   const renderedProviders = useMemo(
//     () =>
//       oauthProviders.map((provider) => {
//         const isGoogle = provider.id === "google";
//         const isLoading = loadingProvider === provider.id;

//         if (typeof provider.icon === "function") {
//           const Icon = provider.icon;
//           return (
//             <button
//               key={provider.id}
//               type="button"
//               onClick={isGoogle ? handleGoogleClick : undefined}
//               disabled={isGoogle && !isScriptLoaded}
//               className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
//             >
//               <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900">
//                 {isLoading ? (
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                 ) : (
//                   <Icon className="h-5 w-5" />
//                 )}
//               </span>
//               <span>
//                 {isGoogle && !isScriptLoaded
//                   ? "Loading Google..."
//                   : provider.label}
//               </span>
//             </button>
//           );
//         }

//         return (
//           <button
//             key={provider.id}
//             type="button"
//             onClick={isGoogle ? handleGoogleClick : undefined}
//             disabled={isGoogle && !isScriptLoaded}
//             className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
//               {isLoading ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <Image
//                   src={provider.icon as string}
//                   alt={provider.label}
//                   width={20}
//                   height={20}
//                   className="object-contain"
//                 />
//               )}
//             </span>
//             <span>
//               {isGoogle && !isScriptLoaded
//                 ? "Loading Google..."
//                 : provider.label}
//             </span>
//           </button>
//         );
//       }),
//     [handleGoogleClick, isScriptLoaded, loadingProvider]
//   );

//   return (
//     <>
//       <Script
//         src="https://accounts.google.com/gsi/client"
//         async
//         defer
//         onLoad={() => {
//           setIsScriptLoaded(true);
//           initializeGoogle();
//         }}
//         strategy="afterInteractive"
//       />

//       <section className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-blue-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-16">
//         <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
//           <header className="flex items-center gap-3 text-blue-600">
//             <button className="rounded-full p-1 transition hover:bg-blue-50">
//               <ArrowLeft className="h-5 w-5" />
//             </button>
//           </header>

//           {/* <div className="mt-8 flex flex-1 flex-col rounded-3xl border border-blue-200 bg-white px-6 py-8 shadow-lg sm:px-8"> */}
//           <div className="mb-8 flex flex-col items-center">
//             <div className="grid place-items-center rounded-full p-6">
//               <Image
//                 src="/Too Clarity.png"
//                 alt="Too Clarity Logo"
//                 width={120}
//                 height={60}
//                 priority
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Enter your phone number
//             </h1>
//             <p className="text-sm text-gray-500">
//               We&apos;ll send you a text with a verification code.
//             </p>
//           </div>

//           <form className="mt-6 space-y-6">
//             <label className="block">
//               <span className="sr-only">Mobile number</span>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
//                   <Smartphone className="h-5 w-5" />
//                 </span>
//                 <input
//                   type="tel"
//                   inputMode="numeric"
//                   placeholder="+91 Mobile number"
//                   className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-base text-gray-900 outline-none transition hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                 />
//               </div>
//             </label>

//             <button
//               type="submit"
//               disabled
//               className="w-full rounded-2xl bg-gray-200 py-3 text-base font-semibold text-gray-500"
//             >
//               Continue
//             </button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-600">
//             Don&apos;t have an account?{" "}
//             <button className="font-semibold text-blue-600 hover:underline">
//               Sign up
//             </button>
//           </div>

//           <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
//             <span className="h-px flex-1 bg-gray-200" />
//             <span>OR</span>
//             <span className="h-px flex-1 bg-gray-200" />
//           </div>

//           <div className="mt-6 space-y-3">{renderedProviders}</div>
//           {/* </div> */}
//         </div>
//       </section>
//     </>
//   );
// };

// export default StudentRegistration;

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Apple,
  Loader2,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { authAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  GoogleCredentialResponse,
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  promptGoogleSignIn,
  redirectToGoogleOAuth,
} from "@/lib/google-auth";

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
  {
    id: "microsoft",
    label: "Continue with Microsoft",
    icon: "/window.svg",
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: Apple,
  },
];

const StudentRegistration: React.FC = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

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
                console.error("Google sign-in failed", response.message);
                return;
              }

              await refreshUser();
              router.replace("/student/dashboard");
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
  }, [refreshUser, router]);

  //   const handleGoogleClick = useCallback(() => {
  //     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  //     if (!clientId) {
  //       console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  //       return;
  //     }

  //     if (isScriptLoaded) {
  //       try {
  //         setLoadingProvider("google");
  //         promptGoogleSignIn();
  //       } catch (error) {
  //         console.error("Failed to prompt Google sign-in", error);
  //         setLoadingProvider(null);
  //       }
  //       return;
  //     }

  //     const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
  //     if (!redirectUri) {
  //       console.error("NEXT_PUBLIC_GOOGLE_REDIRECT_URI is not configured for redirect flow");
  //       return;
  //     }

  //     redirectToGoogleOAuth({ clientId, redirectUri });
  //   }, [isScriptLoaded]);

  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
    const state = JSON.stringify({ state: "student", type: "register" });
    redirectToGoogleOAuth({
      clientId,
      redirectUri,
      userType: "student",
      state: state,
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
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </span>
              <span>
                {disableGoogleButton ? "Loading Google..." : provider.label}
              </span>
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
            <span>
              {disableGoogleButton ? "Loading Google..." : provider.label}
            </span>
          </button>
        );
      }),
    [handleGoogleClick, isScriptLoaded, loadingProvider]
  );

  return (
    <>
      <section className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-blue-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <header className="flex items-center gap-3 text-blue-600">
            <button className="rounded-full p-1 transition hover:bg-blue-50">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </header>

          {/* <div className="mt-8 flex flex-1 flex-col rounded-3xl border border-blue-200 bg-white px-6 py-8 shadow-lg sm:px-8"> */}
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
            Don&apos;t have an account?{" "}
            <button className="font-semibold text-blue-600 hover:underline">
              Sign up
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>OR</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mt-6 space-y-3">{renderedProviders}</div>
          {/* </div> */}
        </div>
      </section>
    </>
  );
};

export default StudentRegistration;