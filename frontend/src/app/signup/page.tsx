"use client"

import { useState, useEffect } from "react";
import L1DialogBox from "@/components/auth/L1DialogBox";
import L2DialogBox from "@/components/auth/L2DialogBox";
import L3DialogBox from "@/components/auth/L3DialogBox";
import CourseOrBranchSelectionDialog from "@/components/auth/CourseOrBranchSelectionDialog";
import Stepper from "@/components/ui/Stepper";

export default function SignupPage() {
  const [l1DialogOpen, setL1DialogOpen] = useState(false);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [l2DialogOpen, setL2DialogOpen] = useState(false);
  const [l3DialogOpen, setL3DialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [l2Section, setL2Section] = useState<"course" | "branch">("course");
  const [formData, setFormData] = useState<{ instituteType?: string }>({});

  // ✅ Dynamic steps
  const steps =
    formData.instituteType === "Study Halls" ||
    formData.instituteType === "Tution Center's"
      ? ["Institute Details", "Program Details"]
      : formData.instituteType
      ? ["Institute Details", "Program Details", "Additional Details"]
      : ["Institute Details"];

  // 🔹 Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedStep = localStorage.getItem("signupStep");
    const savedFormData = localStorage.getItem("signupFormData");

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    if (savedStep) {
      const step = parseInt(savedStep, 10);
      setCurrentStep(step);

      // restore dialog state
      if (step === 1) setL1DialogOpen(true);
      if (step === 2) setSelectionOpen(true); // open selection before L2
      if (step === 3) setL3DialogOpen(true);
    } else {
      setL1DialogOpen(true); // default
    }
  }, []);

  // 🔹 Save step whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("signupStep", String(currentStep));
  }, [currentStep]);

  // 🔹 Save formData whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("signupFormData", JSON.stringify(formData));
    console.log(localStorage.getItem("signupFormData"))
  }, [formData]);

  const handleInstituteTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, instituteType: type }));
  };

  // Handle L1 success → open selection dialog
  const handleL1Success = () => {
    setL1DialogOpen(false);
    setSelectionOpen(true);
    setCurrentStep(2);
  };

  // Handle L2 success → open L3
  const handleL2Success = () => {
    setL2DialogOpen(false);
    setL3DialogOpen(true);
    setCurrentStep(3);
  };

  // Handle L2 previous → back to L1
  const handleL2Previous = () => {
    setL2DialogOpen(false);
    setL1DialogOpen(true);
    setCurrentStep(1);
  };

  // Handle L3 success → finish flow
  const handleL3Success = () => {
    if (typeof window === "undefined") return;
    console.log("Signup completed!");
    setCurrentStep(steps.length);
    localStorage.removeItem("signupStep"); // optional: clear after finish
    localStorage.removeItem("signupFormData");
  };

  // Handle L3 previous → back to L2
  const handleL3Previous = () => {
    setL3DialogOpen(false);
    setL2DialogOpen(true);
    setCurrentStep(2);
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

      {/* Stepper fixed between navbar and dialogs */}
      <div className="fixed top-[64px] md:top-[80px] left-0 right-0 z-40">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-full sm:max-w-4xl mx-auto rounded-xl bg-[#FBF9F5]/95 backdrop-blur-sm">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* L1 Dialog Box */}
      <L1DialogBox
        open={l1DialogOpen}
        onOpenChange={setL1DialogOpen}
        onSuccess={handleL1Success}
        onInstituteTypeChange={handleInstituteTypeChange}
      />

      {/* Selection Dialog between L1 and L2 */}
      <CourseOrBranchSelectionDialog
        open={selectionOpen}
        onOpenChange={setSelectionOpen}
        onSelection={(choice) => {
          setSelectionOpen(false);
          setL2Section(choice);
          setL2DialogOpen(true);
        }}
      />

      {/* L2 Dialog Box */}
      <L2DialogBox
        open={l2DialogOpen}
        onOpenChange={setL2DialogOpen}
        onSuccess={handleL2Success}
        onPrevious={handleL2Previous}
        initialSection={l2Section}
      />

      {/* L3 Dialog Box */}
      <L3DialogBox
        open={l3DialogOpen}
        onOpenChange={setL3DialogOpen}
        onSuccess={handleL3Success}
        onPrevious={handleL3Previous}
      />
    </div>
  );
}
