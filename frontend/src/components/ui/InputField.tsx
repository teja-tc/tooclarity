// "use client";

// import { useState, ChangeEvent, ReactNode } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// interface InputFieldProps {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   placeholder?: string;
//   type?: string;
//   isSelect?: boolean;
//   options?: string[];
//   icon?: ReactNode;
//   inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "search" | "url";
//   pattern?: string;
//   maxLength?: number;
//   numericOnly?: boolean;   // 👈 new prop
// }

// export default function InputField({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   isSelect = false,
//   options = [],
//   icon,
//   inputMode,
//   pattern,
//   maxLength,
//   numericOnly = false,     // 👈 default false
// }: InputFieldProps) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex flex-col gap-2 w-full max-w-[400px] transition-all duration-300">
//       <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
//         {label}
//       </label>

//       {isSelect ? (
//         <div className="relative">
//           {/* Dropdown button */}
//           <div
//             onClick={() => setOpen(!open)}
//             className={`w-full h-[48px] rounded-[12px] p-[12px] bg-[#F5F6F9] flex items-center justify-between cursor-pointer
//               ${value ? "text-black" : "text-[#697282]"}`}
//           >
//             {value || `Select ${label}`}
//             <span className="text-[#697282]">
//               {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </span>
//           </div>

//           {/* Dropdown list */}
//           {open && (
//             <div className="mt-2 bg-white shadow-md rounded-[12px] border border-[#DADADD] flex flex-col">
//               {options.map((opt) => (
//                 <div
//                   key={opt}
//                   onClick={() => {
//                     const event = {
//                       target: { name, value: opt },
//                     } as unknown as ChangeEvent<HTMLSelectElement>;
//                     onChange(event);
//                     setOpen(false);
//                   }}
//                   className="px-4 py-2 hover:bg-[#F5F6F9] cursor-pointer"
//                 >
//                   {opt}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="relative w-full">
//           {icon && (
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center">
//               {icon}
//             </div>
//           )}
//           <input
//             type={type}
//             name={name}
//             value={value}
//             onChange={(e) => {
//               if (numericOnly) {
//                 // keep only numbers
//                 const numericValue = e.target.value.replace(/\D/g, "");
//                 const event = {
//                   ...e,
//                   target: { ...e.target, value: numericValue, name: e.target.name },
//                 };
//                 onChange(event as ChangeEvent<HTMLInputElement>);
//               } else {
//                 // normal behavior
//                 onChange(e);
//               }
//             }}
//             placeholder={placeholder}
//             inputMode={inputMode}
//             pattern={pattern}
//             maxLength={maxLength}
//             className={`w-full h-[48px] rounded-[12px] border border-[#DADADD] bg-[#F5F6F9]
//               placeholder:font-[Montserrat] placeholder:text-[16px] placeholder:text-[#697282]
//               ${icon ? "pl-12" : "p-5"}`}
//           />
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState, ChangeEvent, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  isSelect?: boolean;
  isRadio?: boolean;
  isTextarea?: boolean;
  options?: string[];
  icon?: ReactNode;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "search" | "url";
  pattern?: string;
  maxLength?: number;
  numericOnly?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  isSelect = false,
  isRadio = false,
  isTextarea = false,
  options = [],
  icon,
  inputMode,
  pattern,
  maxLength,
  numericOnly = false,
  required = false,
  disabled = false,
  error,
  className,
  rows = 3,
}: InputFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {isSelect ? (
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className={cn(
              `w-full h-[48px] rounded-[12px] p-[12px] bg-[#F5F6F9] flex items-center justify-between cursor-pointer border border-[#DADADD]`,
              value ? "text-black" : "text-[#697282]",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {value || `Select ${label}`}
            <span className="text-[#697282]">
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </div>

          {open && !disabled && (
            <div className="mt-2 bg-white shadow-md rounded-[12px] border border-[#DADADD] flex flex-col">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    const event = {
                      target: { name, value: opt },
                    } as unknown as ChangeEvent<HTMLSelectElement>;
                    onChange(event);
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[#F5F6F9] cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : isRadio ? (
        <div className="flex gap-4">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      ) : isTextarea ? (
        <textarea
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            `w-full px-4 py-3 border border-[#DADADD] rounded-[12px] bg-[#F5F6F9]
            placeholder:font-[Montserrat] placeholder:text-[16px] placeholder:text-[#697282]
            resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ) : (
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            name={name}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              if (numericOnly) {
                const numericValue = e.target.value.replace(/\D/g, "");
                const event = {
                  ...e,
                  target: { ...e.target, value: numericValue, name: e.target.name },
                };
                onChange(event as ChangeEvent<HTMLInputElement>);
              } else {
                onChange(e);
              }
            }}
            placeholder={placeholder}
            inputMode={inputMode}
            pattern={pattern}
            maxLength={maxLength}
            className={cn(
              `w-full h-[48px] rounded-[12px] border border-[#DADADD] bg-[#F5F6F9]
              placeholder:font-[Montserrat] placeholder:text-[16px] placeholder:text-[#697282]
              ${icon ? "pl-12" : "p-5"}`,
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
