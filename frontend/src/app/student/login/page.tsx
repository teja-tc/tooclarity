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
