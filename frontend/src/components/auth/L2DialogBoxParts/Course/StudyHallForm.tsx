// // "use client";

// // import InputField from "@/components/ui/InputField";
// // import { Upload } from "lucide-react";
// // import type { Course } from "../../L2DialogBox";

// // interface StudyHallFormProps {
// //   currentCourse: Course;
// //   handleCourseChange: (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// //   ) => void;
// //   handleOperationalDayChange: (day: string) => void;
// //   handleFileChange: (
// //     e: React.ChangeEvent<HTMLInputElement>,
// //     type: "image" | "brochure"
// //   ) => void;
// //   setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
// //   courses: Course[];
// //   selectedCourseId: number;
// // }

// // export default function StudyHallForm({
// //   currentCourse,
// //   handleCourseChange,
// //   handleOperationalDayChange,
// //   handleFileChange,
// // }: StudyHallFormProps) {
// //   return (
// //     <div className="grid md:grid-cols-2 gap-6">
// //       <InputField
// //         label="Seating option"
// //         name="seatingOption"
// //         value={currentCourse.seatingOption}
// //         onChange={handleCourseChange}
// //         isSelect
// //         options={["Individual Desk", "Shared Table", "Private Cabin", "Open Seating"]}
// //         placeholder="Select seating option"
// //       />

// //       {/* Opening & Closing Time */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Operational Time's</label>
// //         <div className="grid grid-cols-2 gap-2">
// //           <input
// //             type="time"
// //             name="openingTime"
// //             value={currentCourse.openingTime}
// //             onChange={handleCourseChange}
// //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// //           />
// //           <input
// //             type="time"
// //             name="closingTime"
// //             value={currentCourse.closingTime}
// //             onChange={handleCourseChange}
// //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// //           />
// //         </div>
// //       </div>

// //       {/* Operational Days */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Operational Day's</label>
// //         <div className="flex flex-wrap gap-2">
// //           {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
// //             <button
// //               key={day}
// //               type="button"
// //               onClick={() => handleOperationalDayChange(day)}
// //               className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
// //                 currentCourse.operationalDays.includes(day)
// //                   ? "bg-blue-50 border-blue-200 text-blue-700"
// //                   : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
// //               }`}
// //             >
// //               {day}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Seats */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Total Seats</label>
// //         <div className="grid grid-cols-2 gap-2">
// //           <input
// //             type="number"
// //             name="totalSeats"
// //             value={currentCourse.totalSeats}
// //             onChange={handleCourseChange}
// //             placeholder="Total seats"
// //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// //           />
// //           <input
// //             type="number"
// //             name="availableSeats"
// //             value={currentCourse.availableSeats}
// //             onChange={handleCourseChange}
// //             placeholder="Available seats"
// //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// //           />
// //         </div>
// //       </div>

// //       <InputField
// //         label="Price of the Seat"
// //         name="pricePerSeat"
// //         value={currentCourse.pricePerSeat}
// //         onChange={handleCourseChange}
// //         placeholder="Enter price per seat"
// //         type="number"
// //       />

// //       {/* Upload Image */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Add Image</label>
// //         <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
// //           <Upload size={24} className="text-gray-400 mb-2" />
// //           <span className="text-sm text-gray-500">
// //             {currentCourse.image ? (currentCourse.image as File).name : "Upload Course Image (jpg / jpeg)"}
// //           </span>
// //           <input
// //             type="file"
// //             accept="image/jpeg,image/jpg"
// //             className="hidden"
// //             onChange={(e) => handleFileChange(e, "image")}
// //           />
// //         </label>
// //       </div>

// //       {/* Facilities */}
// //       {[
// //         { name: "hasWifi", label: "Wi-fi ?" },
// //         { name: "hasChargingPoints", label: "Charging Points ?" },
// //         { name: "hasAC", label: "Air Conditioner (AC) ?" },
// //         { name: "hasPersonalLocker", label: "Personal Locker's ?" },
// //       ].map((f) => (
// //         <div key={f.name} className="flex flex-col gap-2">
// //           <label className="font-medium text-[16px]">{f.label}</label>
// //           <div className="flex gap-4">
// //             <label className="flex items-center gap-2">
// //               <input type="radio" name={f.name} value="yes" checked={(currentCourse as any)[f.name] === true} readOnly />
// //               <span className="text-sm">Yes</span>
// //             </label>
// //             <label className="flex items-center gap-2">
// //               <input type="radio" name={f.name} value="no" checked={(currentCourse as any)[f.name] === false} readOnly />
// //               <span className="text-sm">No</span>
// //             </label>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }


// "use client";

// import InputField from "@/components/ui/InputField";
// import { Upload } from "lucide-react";
// import type { Course } from "../../L2DialogBox";
// import React from "react";

// interface StudyHallFormProps {
//   currentCourse: Course;
//   handleCourseChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => void;
//   handleOperationalDayChange: (day: string) => void;
//   handleFileChange: (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "image" | "brochure"
//   ) => void;
//   setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
//   courses: Course[];
//   selectedCourseId: number;
//   // ✅ 1. Accept an error object
//   courseErrors: Record<string, string>;
// }

// export default function StudyHallForm({
//   currentCourse,
//   handleCourseChange,
//   handleOperationalDayChange,
//   handleFileChange,
//   setCourses,
//   courses,
//   selectedCourseId,
//   courseErrors = {}, // ✅ 2. Destructure with a default value
// }: StudyHallFormProps) {

//   // ✅ 3. Add a handler for the Yes/No radio buttons
//   const handleFacilityChange = (name: string, value: boolean) => {
//     setCourses(
//       courses.map((course) =>
//         course.id === selectedCourseId ? { ...course, [name]: value } : course
//       )
//     );
//   };

//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       <InputField
//         label="Seating option"
//         name="seatingOption"
//         value={currentCourse.seatingOption}
//         onChange={handleCourseChange}
//         isSelect
//         options={["Individual Desk", "Shared Table", "Private Cabin", "Open Seating"]}
//         placeholder="Select seating option"
//         error={courseErrors.seatingOption} // ✅ 4. Display error
//         required
//       />

//       {/* Opening & Closing Time */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Operational Time's *</label>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <input
//               type="time"
//               name="openingTime"
//               value={currentCourse.openingTime}
//               onChange={handleCourseChange}
//               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
//                   courseErrors.openingTime ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {courseErrors.openingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.openingTime}</p>}
//           </div>
//           <div>
//             <input
//               type="time"
//               name="closingTime"
//               value={currentCourse.closingTime}
//               onChange={handleCourseChange}
//               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
//                   courseErrors.closingTime ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {courseErrors.closingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.closingTime}</p>}
//           </div>
//         </div>
//       </div>

//       {/* Operational Days */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Operational Day's *</label>
//         <div className="flex flex-wrap gap-2">
//           {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
//             <button
//               key={day} type="button" onClick={() => handleOperationalDayChange(day)}
//               className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
//                 currentCourse.operationalDays.includes(day)
//                   ? "bg-blue-50 border-blue-200 text-blue-700"
//                   : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               {day}
//             </button>
//           ))}
//         </div>
//         {courseErrors.operationalDays && <p className="text-sm text-red-600 mt-1">{courseErrors.operationalDays}</p>}
//       </div>

//       {/* Seats */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Total Seats *</label>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <input
//               type="number" name="totalSeats" value={currentCourse.totalSeats} onChange={handleCourseChange} placeholder="Total seats"
//               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
//                   courseErrors.totalSeats ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {courseErrors.totalSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.totalSeats}</p>}
//           </div>
//           <div>
//             <input
//               type="number" name="availableSeats" value={currentCourse.availableSeats} onChange={handleCourseChange} placeholder="Available seats"
//               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
//                   courseErrors.availableSeats ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {courseErrors.availableSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.availableSeats}</p>}
//           </div>
//         </div>
//       </div>

//       <InputField
//         label="Price of the Seat"
//         name="pricePerSeat"
//         value={currentCourse.pricePerSeat}
//         onChange={handleCourseChange}
//         placeholder="Enter price per seat"
//         type="number"
//         error={courseErrors.pricePerSeat} // ✅ 4. Display error
//         required
//       />

//       {/* Upload Image */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Add Image</label>
//         <label className={`w-full h-[120px] rounded-[12px] border-2 border-dashed bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors ${
//             courseErrors.image ? "border-red-500" : "border-[#DADADD]"
//         }`}>
//             {/* ... upload content ... */}
//         </label>
//         {courseErrors.image && <p className="text-sm text-red-600 mt-1">{courseErrors.image}</p>}
//       </div>

//       {/* Facilities */}
//       {[
//         { name: "hasWifi", label: "Wi-fi ?" },
//         { name: "hasChargingPoints", label: "Charging Points ?" },
//         { name: "hasAC", label: "Air Conditioner (AC) ?" },
//         { name: "hasPersonalLocker", label: "Personal Locker's ?" },
//       ].map((f) => (
//         <div key={f.name} className="flex flex-col gap-2">
//           <label className="font-medium text-[16px]">{f.label} *</label>
//           <div className="flex gap-4">
//             <label className="flex items-center gap-2 cursor-pointer">
//               {/* ✅ 5. Fixed radio buttons */}
//               <input type="radio" name={f.name} value="yes"
//                 checked={(currentCourse as any)[f.name] === true}
//                 onChange={() => handleFacilityChange(f.name, true)}
//               />
//               <span className="text-sm">Yes</span>
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="radio" name={f.name} value="no"
//                 checked={(currentCourse as any)[f.name] === false}
//                 onChange={() => handleFacilityChange(f.name, false)}
//               />
//               <span className="text-sm">No</span>
//             </label>
//           </div>
//           {courseErrors[f.name as keyof Course] && <p className="text-sm text-red-600 mt-1">{courseErrors[f.name as keyof Course]}</p>}
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { Upload, Clock, Building, IndianRupee } from "lucide-react";
import type { Course } from "../../L2DialogBox";
import React from "react";
import InputField from "@/components/ui/InputField";


interface StudyHallFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleOperationalDayChange: (day: string) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "brochure"
  ) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  
  courses: Course[];
  
  selectedCourseId: number;
  courseErrors: Record<string, string>;
}

// Helper component for inputs with icons to keep the code clean
const IconInput = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="relative flex items-center">
    <span className="absolute left-4 text-gray-400">{icon}</span>
    {children}
  </div>
);
// ✅ 1. Create a specific type for just the facility keys.
type FacilityKey = "hasWifi" | "hasChargingPoints" | "hasAC" | "hasPersonalLocker";

export default function StudyHallForm({
  currentCourse,
  handleCourseChange,
  handleOperationalDayChange,
  handleFileChange,
  setCourses,
  courses,
  
  selectedCourseId,
  courseErrors = {},
  
}: StudyHallFormProps) {

  const handleFacilityChange = (name: string, value: boolean) => {
    setCourses(
      courses.map((course) =>
        course.id === selectedCourseId ? { ...course, [name]: value } : course
      )
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
      
      {/* Seating Option */}
   <InputField
  label="Seating option"
  name="seatingOption"
  value={currentCourse.seatingOption}
  onChange={handleCourseChange}
  isSelect
  options={["Individual Desk", "Shared Table", "Private Cabin", "Open Seating"]}
  placeholder="Select seating option"
  required
  error={courseErrors.seatingOption}
/>


      {/* Operational Times */}
      <div className="flex flex-col gap-3">
        <label className="font-medium text-lg text-black">Operational Time’s<span className="text-red-500 ml-1">*</span></label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <IconInput icon={<Clock size={20} />}>
              <input type="time" name="openingTime" value={currentCourse.openingTime} onChange={handleCourseChange} placeholder="From"
                className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl font-normal text-base ${courseErrors.openingTime ? "border-red-500" : "border-[#DADADD]"}`} />
            </IconInput>
            {courseErrors.openingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.openingTime}</p>}
          </div>
          <div>
            <IconInput icon={<Clock size={20} />}>
              <input type="time" name="closingTime" value={currentCourse.closingTime} onChange={handleCourseChange} placeholder="To"
                className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl font-normal text-base ${courseErrors.closingTime ? "border-red-500" : "border-[#DADADD]"}`} />
            </IconInput>
            {courseErrors.closingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.closingTime}</p>}
          </div>
        </div>
      </div>

      {/* Operational Days */}
      <div className="flex flex-col gap-3">
        <label className="font-medium text-lg text-black">Operational Day’s<span className="text-red-500 ml-1">*</span></label>
        <div className="flex flex-wrap gap-2">
          {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
            <button key={day} type="button" onClick={() => handleOperationalDayChange(day)}
              className={`h-12 w-[60px] rounded-lg text-base border transition-colors ${currentCourse.operationalDays.includes(day) ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-[#DADADD] text-[#060B13] hover:bg-gray-100"}`}>
              {day}
            </button>
          ))}
        </div>
        {courseErrors.operationalDays && <p className="text-sm text-red-600 mt-1">{courseErrors.operationalDays}</p>}
      </div>

      {/* Total Seats */}
      <div className="flex flex-col gap-3">
        <label className="font-medium text-lg text-black">Total Seats<span className="text-red-500 ml-1">*</span></label>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <IconInput icon={<Building size={20} />}>
              <input type="number" name="totalSeats" value={currentCourse.totalSeats} onChange={handleCourseChange} placeholder="Total seats"
                className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl font-normal text-base ${courseErrors.totalSeats ? "border-red-500" : "border-[#DADADD]"}`} />
            </IconInput>
            {courseErrors.totalSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.totalSeats}</p>}
          </div>
          <div>
            <IconInput icon={<Building size={20} />}>
              <input type="number" name="availableSeats" value={currentCourse.availableSeats} onChange={handleCourseChange} placeholder="Available seats"
                className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl font-normal text-base ${courseErrors.availableSeats ? "border-red-500" : "border-[#DADADD]"}`} />
            </IconInput>
            {courseErrors.availableSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.availableSeats}</p>}
          </div>
        </div>
      </div>

      {/* Price of the Seat */}
      <div className="flex flex-col gap-3">
        <label className="font-medium text-lg text-black">Price of the Seat<span className="text-red-500 ml-1">*</span></label>
        <IconInput icon={<IndianRupee size={20} />}>
          <input type="number" name="pricePerSeat" value={currentCourse.pricePerSeat} onChange={handleCourseChange} placeholder="Enter price per seat"
            className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl font-normal text-base ${courseErrors.pricePerSeat ? "border-red-500" : "border-[#DADADD]"}`} />
        </IconInput>
        {courseErrors.pricePerSeat && <p className="text-sm text-red-600 mt-1">{courseErrors.pricePerSeat}</p>}
      </div>
      
      {/* Add Image */}
      <div className="flex flex-col gap-3">
        <label className="font-medium text-lg text-black">Add Image<span className="text-red-500 ml-1">*</span></label>
        <label className={`w-full h-[81px] rounded-xl border border-dashed bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${courseErrors.image ? "border-red-500" : "border-[#DADADD]"}`}>
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-[#697282]">{currentCourse.image ? (currentCourse.image as File).name : "Upload Course Image (jpg / jpeg)."}</span>
          <input type="file" accept="image/jpeg,image/jpg" className="hidden" onChange={(e) => handleFileChange(e, "image")} />
        </label>
        {courseErrors.image && <p className="text-sm text-red-600 mt-1">{courseErrors.image}</p>}
      </div>

      {/* Facilities */}
      {([
        { name: "hasWifi", label: "Wi-fi ?" },
        { name: "hasChargingPoints", label: "Charging Points ?" },
        { name: "hasAC", label: "Air Conditioner (AC) ?" },
        { name: "hasPersonalLocker", label: "Personal Locker's ?" },
      ] as { name: FacilityKey; label: string }[]).map((f) => (
        <div key={f.name} className="flex flex-col gap-3">
          <label className="font-medium text-lg">{f.label}<span className="text-red-500 ml-1">*</span></label>
          <div className="flex items-center gap-4 h-12">
            <label className="flex items-center gap-2 cursor-pointer">
              {/* ✅ 3. The error is now gone, as TypeScript knows `f.name` is a FacilityKey */}
              <input type="radio" name={f.name} value="yes" 
                checked={currentCourse[f.name] === true} 
                onChange={() => handleFacilityChange(f.name, true)} 
                className="h-4 w-4" 
              />
              <span className="text-base text-[#060B13]">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={f.name} value="no" 
                checked={currentCourse[f.name] === false} 
                onChange={() => handleFacilityChange(f.name, false)} 
                className="h-4 w-4" 
              />
              <span className="text-base text-[#060B13]">No</span>
            </label>
          </div>
          {courseErrors[f.name] && <p className="text-sm text-red-600 mt-1">{courseErrors[f.name]}</p>}
        </div>
      ))}
    </div>
  );
}