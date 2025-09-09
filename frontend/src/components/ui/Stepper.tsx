// "use client";

// import { cn } from "@/lib/utils";

// interface StepperProps {
//   steps: string[];
//   currentStep: number; // 1-based index
// }

// export default function Stepper({ steps, currentStep }: StepperProps) {
//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between relative">
//         {steps.map((step, index) => {
//           const stepNumber = index + 1;
//           const isCompleted = stepNumber < currentStep;
//           const isActive = stepNumber === currentStep;

//           return (
//             <div key={step} className="flex-1 flex flex-col items-center">
//               {/* Step Circle */}
//               <div
//                 className={cn(
//                   "w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-all",
//                   isCompleted
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : isActive
//                     ? "bg-white border-blue-600 text-blue-600"
//                     : "bg-gray-200 border-gray-300 text-gray-500"
//                 )}
//               >
//                 {stepNumber}
//               </div>

//               {/* Step Label */}
//               <p
//                 className={cn(
//                   "mt-2 text-sm font-medium text-center",
//                   isActive
//                     ? "text-blue-600"
//                     : isCompleted
//                     ? "text-gray-700"
//                     : "text-gray-400"
//                 )}
//               >
//                 {step}
//               </p>
//             </div>
//           );
//         })}
//       </div>

//       {/* Connecting Line */}
//       <div className="absolute top-5 left-0 w-full flex justify-between px-5">
//         {steps.slice(0, -1).map((_, index) => {
//           const stepNumber = index + 1;
//           const isPassed = stepNumber < currentStep;

//           return (
//             <div
//               key={index}
//               className={cn(
//                 "flex-1 h-1 mx-2 rounded",
//                 isPassed ? "bg-blue-600" : "bg-gray-300"
//               )}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// "use client";
// import React from "react";

// type StepperProps = {
//   currentStep: number;
//   steps: string[];
//   className?: string;
// };

// const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
//   return (
//     <div
//        className={`flex items-center justify-center gap-4 w-full mb-8 ${className}`}
//     >
//       {steps.map((step, index) => {
//         const stepNumber = index + 1;
//         const isActive = currentStep === stepNumber;
//         const isCompleted = currentStep > stepNumber;

//         return (
//           <div key={index} className="flex items-center">
//   {/* Circle + Labels */}
//   <div className="flex flex-col items-center justify-center gap-[12px]">
//     {/* Circle */}
//     {/* <div
//       className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold
//         ${isActive ? "bg-blue-600" : isCompleted ? "bg-green-500" : "bg-gray-300"}
//       `}
//     >
//       {isCompleted ? "✓" : stepNumber}
//     </div> */}
//     {/* <div
//   className={`w-6 h-6 flex items-center justify-center rounded-full 
//     ${isActive ? "bg-blue-600" : isCompleted ? "bg-green-500" : "bg-[#F5F6F9]"}
//   `}
// >
//   <span
//     className="font-montserrat font-medium text-[16px] leading-[100%] text-center text-white"
//   >
//     {isCompleted ? "✓" : stepNumber}
//   </span>
// </div> */}
// {/* <div
//                 className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold
//                   ${isActive ? "bg-blue-600" : isCompleted ? "bg-green-500" : "bg-gray-300"}
//                 `}
//               >
//                 {isCompleted ? "✓" : stepNumber}
//               </div> */}
//               <div
//   className={`w-[30px] h-[30px] flex items-center justify-center rounded-full 
//     ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
//   `}
// >
//   <span
//     className={`font-montserrat font-medium text-[16px] leading-[20px] text-center 
//       ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
//     `}
//   >
//     {isCompleted ? "✓" : stepNumber}
//   </span>
// </div>


//     {/* <div
//   className={`w-[30px] h-[30px] flex items-center justify-center rounded-full text-white text-xs font-bold
//     ${isActive ? "bg-blue-600" : isCompleted ? "bg-green-500" : "bg-gray-300"}
//   `}
// >
//   {isCompleted ? "✓" : stepNumber}
// </div> */}

//     {/* Labels
//     <div className="flex flex-col items-center gap-[2px] w-[97px] h-[27px] mx-auto">
//       <p className="text-[8px] leading-[10px] tracking-[0.05em] font-montserrat font-medium text-[#697282]">
//         STEP {stepNumber}
//       </p>
//       <p className="text-[12px] leading-[15px] font-montserrat font-medium text-center text-[#060B13]">
//         {step}
//       </p>
//     </div> */}
//     {/* Labels */}
// <div className="flex flex-col items-center gap-[2px] w-[97px] h-[27px] mx-auto">
//   {/* STEP 1 */}
//   {/* <p className="w-[28px] h-[10px] font-montserrat font-medium text-[8px] leading-[10px] tracking-[0.05em] text-[#697282]">
//     STEP {stepNumber}
//   </p> */}
//   <p
//   className="w-[28px] h-[10px] font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282] opacity-100"
// >
//   STEP {stepNumber}
// </p>


//   {/* Institute Details */}
//   {/* <p className="w-[97px] h-[15px] font-montserrat font-medium text-[12px] leading-[15px] text-center text-[#060B13]">
//     {step}
//   </p> */}
//   <p
//   className="w-[109px] h-[15px] font-montserrat font-medium text-[12px] leading-[100%] tracking-[0%] text-center text-[#000000] opacity-100"
// >
//   {step}
// </p>

// </div>




//   </div>

//   {/* Connector Line (Figma style) */}
// {index < steps.length - 1 && (
//   <div className="self-start h-[30px] flex items-center mx-[8px]">
//     <div
//       className={`h-[2px] w-[167px] rounded-[11px] ${
//         isCompleted ? "bg-green-500" : "bg-[#DADADD]"
//       }`}
//     />
//   </div>
// )}


// </div>
// //   <div
// //     className={`h-[2px] w-[167px] rounded-[11px] ${
// //       isCompleted ? "bg-green-500" : "bg-[#DADADD]"
// //     }`}
// //   />
// // )}

// //           </div>
      
//         );
//       })}
//     </div>
//   );
// };

// export default Stepper;
// "use client";
// import React from "react";

// type StepperProps = {
//   currentStep: number;
//   steps: string[];
//   className?: string;
// };

// const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
//   return (
//     <div className={`flex items-center justify-center gap-4 w-full mb-8 ${className}`}>
//       {steps.map((step, index) => {
//         const stepNumber = index + 1;
//         const isActive = currentStep === stepNumber;
//         const isCompleted = currentStep > stepNumber;

//         return (
//           <div key={index} className="flex items-center">
//             <div className="flex flex-col items-center justify-center gap-[12px]">
//               <div
//                 className={`w-[30px] h-[30px] flex items-center justify-center rounded-full 
//                   ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
//                 `}
//               >
//                 <span
//                   className={`font-montserrat font-medium text-[16px] leading-[20px] text-center 
//                     ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
//                   `}
//                 >
//                   {isCompleted ? "✓" : stepNumber}
//                 </span>
//               </div>

//               <div className="flex flex-col items-center gap-[2px] w-[97px] h-[27px] mx-auto">
//                 <p className="w-[28px] h-[10px] font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282] opacity-100">
//                   STEP {stepNumber}
//                 </p>
//                 <p className="w-[109px] h-[15px] font-montserrat font-medium text-[12px] leading-[100%] tracking-[0%] text-center text-[#000000] opacity-100">
//                   {step}
//                 </p>
//               </div>
//             </div>

//             {index < steps.length - 1 && (
//               <div className="self-start h-[30px] flex items-center mx-[8px]">
//                 <div
//                   className={`h-[2px] w-[167px] rounded-[11px] ${
//                     isCompleted ? "bg-green-500" : "bg-[#DADADD]"
//                   }`}
//                 />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Stepper;
// "use client";
// import React from "react";

// type StepperProps = {
//   currentStep: number;
//   steps: string[];
//   className?: string;
// };

// const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
//   return (
//     <div className={`flex items-center justify-center gap-4 w-full mb-8 ${className}`}>
//   {steps.map((step, index) => {
//     const stepNumber = index + 1;
//     const isActive = currentStep === stepNumber;
//     const isCompleted = currentStep > stepNumber;

//     return (
//       <div key={index} className="flex items-center">
//         <div className="flex flex-col items-center justify-center gap-[8px]">
//           <div
//             className={`w-[30px] h-[30px] flex items-center justify-center rounded-full 
//               ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
//             `}
//           >
//             <span
//               className={`font-montserrat font-medium text-[16px] leading-[20px] text-center 
//                 ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
//               `}
//             >
//               {isCompleted ? "✓" : stepNumber}
//             </span>
//           </div>

//           <div className="flex flex-col items-center gap-[2px] w-[97px] h-[27px] mx-auto">
//             <p className="w-[28px] h-[10px] font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282] opacity-100">
//               STEP {stepNumber}
//             </p>
//             <p className="w-[109px] h-[15px] font-montserrat font-medium text-[12px] leading-[100%] tracking-[0%] text-center text-[#000000] opacity-100">
//               {step}
//             </p>
//           </div>
//         </div>

//       {index < steps.length - 1 && (
//   <div className="self-start h-[30px] flex items-center mx-[2px]">
//     <div
//       className={`h-[2px] w-[120px] rounded-[11px] ${
//         isCompleted ? "bg-green-500" : "bg-[#DADADD]"
//       }`}
//     />
//   </div>
// )}

//       </div>
//     );
//   })}
// </div>

//     // <div className={`flex items-center justify-center gap-4 w-full mb-8 ${className}`}>
//     //   {steps.map((step, index) => {
//     //     const stepNumber = index + 1;
//     //     const isActive = currentStep === stepNumber;
//     //     const isCompleted = currentStep > stepNumber;

//     //     return (
//     //       <div key={index} className="flex items-center">
//     //         <div className="flex flex-col items-center justify-center gap-[8px]"> {/* reduced from 12px */}
//     //           <div
//     //             className={`w-[30px] h-[30px] flex items-center justify-center rounded-full 
//     //               ${isCompleted ? "bg-[#1FC274]" : isActive ? "bg-[#0222D7]" : "bg-[#F5F6F9]"}
//     //             `}
//     //           >
//     //             <span
//     //               className={`font-montserrat font-medium text-[16px] leading-[20px] text-center 
//     //                 ${isCompleted ? "text-white" : isActive ? "text-white" : "text-[#697282]"}
//     //               `}
//     //             >
//     //               {isCompleted ? "✓" : stepNumber}
//     //             </span>
//     //           </div>

//     //           <div className="flex flex-col items-center gap-[2px] w-[97px] h-[27px] mx-auto">
//     //             <p className="w-[28px] h-[10px] font-montserrat font-medium text-[8px] leading-[100%] tracking-[0.05em] text-[#697282] opacity-100">
//     //               STEP {stepNumber}
//     //             </p>
//     //             <p className="w-[109px] h-[15px] font-montserrat font-medium text-[12px] leading-[100%] tracking-[0%] text-center text-[#000000] opacity-100">
//     //               {step}
//     //             </p>
//     //           </div>
//     //         </div>

//     //         {index < steps.length - 1 && (
//     //           <div className="self-start h-[30px] flex items-center mx-[4px]"> {/* reduced from 8px */}
//     //             <div
//     //               className={`h-[2px] w-[167px] rounded-[11px] ${
//     //                 isCompleted ? "bg-green-500" : "bg-[#DADADD]"
//     //               }`}
//     //             />
//     //           </div>
//     //         )}
//     //       </div>
//     //     );
//     //   })}
//     // </div>
//   );
// };

// export default Stepper;
"use client";
import React from "react";

type StepperProps = {
  currentStep: number;
  steps: string[];
  className?: string;
};

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-center sm:justify-center gap-4 w-full mb-8 ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center w-full sm:w-auto"
          >
            {/* Step Circle and Label */}
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-[8px]">
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
              <div className="flex sm:flex-1 justify-center items-center w-full sm:w-auto my-1 sm:my-0">
                <div
                  className={`h-[2px] sm:h-[2px] w-[50px] sm:w-[120px] rounded-[11px] ${
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
