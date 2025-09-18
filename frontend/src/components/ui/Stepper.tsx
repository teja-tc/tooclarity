// // // "use client";
// // // import React from "react";

// // // type StepperProps = {
// // //   currentStep: number;
// // //   steps: string[];
// // //   className?: string;
// // // };

// // // const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
// // //   return (
// // //     <div className={`flex flex-col sm:flex-row items-center sm:justify-center gap-4 w-full mb-8 ${className}`}>
// // //       {steps.map((step, index) => {
// // //         const stepNumber = index + 1;
// // //         const isActive = currentStep === stepNumber;
// // //         const isCompleted = currentStep > stepNumber;

// // //         return (
// // //           <div
// // //             key={index}
// // //             className="flex flex-col sm:flex-row items-center w-full sm:w-auto"
// // //           >
// // //             {/* Step Circle and Label */}
// // //             <div className="flex flex-col items-center justify-center gap-2 sm:gap-[8px]">
// // //               <div
// // //                 className={`w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full 
// // //                   ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
// // //                 `}
// // //               >
// // //                 <span
// // //                   className={`font-montserrat font-medium text-[14px] sm:text-[16px] leading-[20px] text-center 
// // //                     ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
// // //                   `}
// // //                 >
// // //                   {isCompleted ? "✓" : stepNumber}
// // //                 </span>
// // //               </div>

// // //               <div className="flex flex-col items-center gap-[2px] text-center w-[60px] sm:w-[97px]">
// // //                 <p className="font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282]">
// // //                   STEP {stepNumber}
// // //                 </p>
// // //                 <p className="font-montserrat font-medium text-[10px] sm:text-[12px] leading-[100%] text-[#000] truncate">
// // //                   {step}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             {/* Connecting Line */}
// // //             {index < steps.length - 1 && (
// // //               <div className="flex sm:flex-1 justify-center items-center w-full sm:w-auto my-1 sm:my-0">
// // //                 <div
// // //                   className={`h-[2px] sm:h-[2px] w-[50px] sm:w-[120px] rounded-[11px] ${
// // //                     isCompleted ? "bg-green-500" : "bg-[#DADADD]"
// // //                   }`}
// // //                 />
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //       })}
// // //     </div>
// // //   );
// // // };

// // // export default Stepper;

"use client";
import React from "react";

type StepperProps = {
  currentStep: number;
  steps: string[];
  className?: string;
};

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
  return (
    <div className={`flex flex-row items-center justify-center gap-4 w-full mb-8 ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div key={index} className="flex flex-row items-center w-auto">
            {/* Step Circle and Label */}
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
                  {isCompleted ? "✓" : stepNumber}
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
              <div className="flex justify-center items-center">
                <div
                  className={`h-[2px] w-[50px] sm:w-[120px] rounded-[11px] ${
                    isCompleted ? "bg-green-500" : "bg-[#DADADD]"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

// "use client";
// import React from "react";

// type StepperProps = {
//   currentStep: number;
//   steps: string[];
//   className?: string;
// };

// const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
//   return (
//     // Main container: Changed to flex-col with a gap to stack the rows.
//     <div
//       className={`flex flex-col items-center justify-center gap-3 w-full mb-8 ${className}`}
//     >
//       {/* Row 1: Circles and Connecting Lines */}
//       <div className="flex flex-row items-center justify-center">
//         {steps.map((step, index) => {
//           const stepNumber = index + 1;
//           const isActive = currentStep === stepNumber;
//           const isCompleted = currentStep > stepNumber;

//           return (
//             <React.Fragment key={`step-indicator-${index}`}>
//               {/* Step Circle (Unchanged) */}
//               <div
//                 className={`w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full 
//                   ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
//                 `}
//               >
//                 <span
//                   className={`font-montserrat font-medium text-[14px] sm:text-[16px] leading-[20px] text-center 
//                     ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
//                   `}
//                 >
//                   {isCompleted ? "✓" : stepNumber}
//                 </span>
//               </div>

//               {/* Connecting Line */}
//               {index < steps.length - 1 && (
//                 <div
//                   // Added margin to create space between circle and line.
//                   // Adjusted width for responsiveness and corrected completed color.
//                   className={`mx-2 h-[2px] w-[140px] sm:w-[167px] rounded-[11px] ${
//                     isCompleted ? "bg-[#1FC274]" : "bg-[#DADADD]"
//                   }`}
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       {/* Row 2: Step Labels (This is the new separated row) */}
//       <div className="flex flex-row justify-between w-full max-w-[542px] px-[10px]">
//         {steps.map((step, index) => {
//           const stepNumber = index + 1;
//           return (
//             <div
//               key={`step-label-${index}`}
//               // Adjusted width to better match Figma's varying label sizes.
//               className="flex flex-col items-center gap-[2px] text-center w-[97px] sm:w-[109px]"
//             >
//               <p className="font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282]">
//                 STEP {stepNumber}
//               </p>
//               <p className="font-montserrat font-medium text-[10px] sm:text-[12px] leading-[100%] text-[#000] truncate">
//                 {step}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Stepper;

