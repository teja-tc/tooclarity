"use client";
import React from "react";

type StepperProps = {
  currentStep: number;
  steps: string[];
  className?: string;
};

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
  return (
    // ✅ FIX: Removed the `gap-2` from this container.
    <div className={`flex flex-row items-start justify-center w-full mb-8 ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <React.Fragment key={index}>
            {/* Step Circle and Label Block */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                className={`w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full 
                  ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
                `}
              >
                <span
                  className={`font-montserrat font-medium text-[14px] sm:text-[16px] leading-[20px] text-center 
                    ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
                  `}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </span>
              </div>

              <div className="flex flex-col items-center gap-[2px] text-center w-[60px] sm:w-[97px]">
                <p className="font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282]">
                  STEP {stepNumber}
                </p>
                <p className="font-montserrat font-medium text-[10px] sm:text-[12px] leading-[100%] text-[#000] truncate">
                  {step}
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] w-[50px] sm:w-[120px] rounded-[11px] mt-[11px] sm:mt-[14px] ${
                  isCompleted ? "bg-[#1FC274]" : "bg-[#DADADD]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;