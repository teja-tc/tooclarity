"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentRegistration from "@/components/student/StudentRegistration";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/user-store";

const StudentSignupPage = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const user = useUserStore((state) => state.user);

  // Called after successful registration
  const handleSignupSuccess = async () => {
    await refreshUser();
  };

  // Redirect after user state updates
  useEffect(() => {
    if (!user) return;

    const role = user.role;
    const isPaymentDone = !!user.isPaymentDone;
    const isProfileCompleted = !!user.isProfileCompleted;

    console.log("[Student Signup Page] Redirecting with flags:", {
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
        router.replace("/dashboard");
        return;
      }
    }

    // Fallback
    router.replace("/dashboard");
  }, [user, router]);

  return <StudentRegistration onSuccess={handleSignupSuccess} />;
};

export default StudentSignupPage;