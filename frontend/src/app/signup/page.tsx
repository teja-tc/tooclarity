"use client";

import { useState, useEffect } from "react";
import L1DialogBox from "@/components/auth/L1DialogBox";
import L2DialogBox from "@/components/auth/L2DialogBox";
import L3DialogBox from "@/components/auth/L3DialogBox";

export default function SignupPage() {
  const [l1DialogOpen, setL1DialogOpen] = useState(false);
  const [l2DialogOpen, setL2DialogOpen] = useState(false);
  const [l3DialogOpen, setL3DialogOpen] = useState(false);

  // Automatically open L1 dialog when component mounts
  useEffect(() => {
    setL1DialogOpen(true);
  }, []);

  // Handle L1 success - open L2 dialog
  const handleL1Success = () => {
    setL2DialogOpen(true);
  };

  // Handle L2 success - open L3 dialog (Study Halls and Tution Centers redirect directly to dashboard from L2)
  const handleL2Success = () => {
    setL3DialogOpen(true);
  };

  // Handle L3 success - complete the flow
  const handleL3Success = () => {
    console.log("Signup completed!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF9F5]">
      {/* Top navigation bar */}
      <div className="w-full h-auto sm:h-[64px] md:h-[80px] flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 md:px-20 z-10 fixed top-0 left-0 py-3 sm:py-0">
        <img
          src="/Too%20Clarity.png"
          alt="Too Clarity Logo"
          className="h-6 sm:h-7 w-auto mb-2 sm:mb-0"
        />
        <a
          href="tel:+919391160205"
          className="text-xs sm:text-sm text-blue-700 flex items-center gap-1 hover:underline transition-all duration-200"
        >
          <span className="hidden sm:inline">Need help? Call</span>
          <span className="sm:hidden">Call</span>
          +91 9391160205
        </a>
      </div>

      {/* L1 Dialog Box - Opens automatically */}
      <L1DialogBox 
        open={l1DialogOpen}
        onOpenChange={setL1DialogOpen}
        onSuccess={handleL1Success}
      />

      {/* L2 Dialog Box - Opens after L1 success */}
      <L2DialogBox 
        open={l2DialogOpen}
        onOpenChange={setL2DialogOpen}
        onSuccess={handleL2Success}
      />

      {/* L3 Dialog Box - Opens after L2 success */}
      <L3DialogBox 
        open={l3DialogOpen}
        onOpenChange={setL3DialogOpen}
        onSuccess={handleL3Success}
      />
    </div>
  );
}
