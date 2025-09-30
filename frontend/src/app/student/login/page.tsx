// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import StudentLogin from "@/components/student/StudentLogin";
// import { useAuth } from "@/lib/auth-context";
// import { useUserStore } from "@/lib/user-store";

// const StudentLoginPage = () => {
//   const router = useRouter();
//   const { refreshUser } = useAuth();

//   const handleLoginSuccess = async () => {
//     // Ensure we have the latest user profile in store
//     await refreshUser();

//     // Read fresh snapshot from Zustand store (avoid stale closure)
//     const latestUser = useUserStore.getState().user;
//     console.log("[Student Login Route] Zustand user after login:", latestUser);

//     // Decide destination based on role and flags
//     const role = latestUser?.role;
//     const isPaymentDone = !!latestUser?.isPaymentDone;
//     const isProfileCompleted = !!latestUser?.isProfileCompleted;
//     console.log("[Student Login Route] Flags:", { role, isPaymentDone, isProfileCompleted });

//     if (role === "STUDENT") {
//       if (!isProfileCompleted) {
//         router.push("/student/onboarding");
//         return;
//       }
//       if (isProfileCompleted) {
//         router.push("/dashboard");
//         return;
//       }
//     }

//     // Fallback
//     router.push("/student/dashboard");
//   };

//   return <StudentLogin onSuccess={handleLoginSuccess} />;
// };

// export default StudentLoginPage;

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentLogin from "@/components/student/StudentLogin";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/user-store";

const StudentLoginPage = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Subscribe to user state directly from Zustand
  const user = useUserStore((state) => state.user);

  // Called by StudentLogin after Google/email login success
  const handleLoginSuccess = async () => {
    await refreshUser();
  };

  // Watch for user changes and redirect accordingly
  useEffect(() => {
    if (!user) return;

    const role = user.role;
    const isPaymentDone = !!user.isPaymentDone;
    const isProfileCompleted = !!user.isProfileCompleted;

    console.log("[Student Login Page] Redirecting with flags:", {
      role,
      isPaymentDone,
      isProfileCompleted,
    });

    if (role === "STUDENT") {
      if (!isProfileCompleted) {
        router.replace("/student/onboarding");
        return;
      }
      if (isProfileCompleted) {
        router.replace("/dashboard"); // ✅ fixed path
        return;
      }
    }

    // Fallback
    router.replace("/dashboard");
  }, [user, router]);

  return <StudentLogin onSuccess={handleLoginSuccess} />;
};

export default StudentLoginPage;
