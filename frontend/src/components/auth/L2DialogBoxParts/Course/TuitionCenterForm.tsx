// // // // "use client";

// // // // import InputField from "@/components/ui/InputField";
// // // // import { Upload } from "lucide-react";
// // // // import type { Course } from "../../L2DialogBox";


// // // // interface TuitionCenterFormProps {
// // // //   currentCourse: Course;
// // // //   handleCourseChange: (
// // // //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// // // //   ) => void;
// // // //   handleOperationalDayChange: (day: string) => void;
// // // //   handleFileChange: (
// // // //     e: React.ChangeEvent<HTMLInputElement>,
// // // //     type: "image" | "brochure"
// // // //   ) => void;
// // // //   setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
// // // //   courses: Course[];
// // // //   selectedCourseId: number;
// // // // }

// // // // export default function TuitionCenterForm({
// // // //   currentCourse,
// // // //   handleCourseChange,
// // // //   handleOperationalDayChange,
// // // //   handleFileChange,
// // // // }: TuitionCenterFormProps) {
// // // //   return (
// // // //     <div className="grid md:grid-cols-2 gap-6">
// // // //       <InputField
// // // //         label="Tuition type"
// // // //         name="tuitionType"
// // // //         value={currentCourse.tuitionType}
// // // //         onChange={handleCourseChange}
// // // //         isSelect
// // // //         options={["Individual", "Group", "Online", "Hybrid"]}
// // // //         placeholder="Select tuition type"
// // // //       />

// // // //       <InputField
// // // //         label="Instructor Profile"
// // // //         name="instructorProfile"
// // // //         value={currentCourse.instructorProfile}
// // // //         onChange={handleCourseChange}
// // // //         placeholder="Instructor name"
// // // //       />

// // // //       <InputField
// // // //         label="Subject"
// // // //         name="subject"
// // // //         value={currentCourse.subject}
// // // //         onChange={handleCourseChange}
// // // //         placeholder="Enter subject name"
// // // //       />

// // // //       {/* Seats */}
// // // //       <div className="flex flex-col gap-2">
// // // //         <label className="font-medium text-[16px]">Total Seats</label>
// // // //         <div className="grid grid-cols-2 gap-2">
// // // //           <input
// // // //             type="number"
// // // //             name="totalSeats"
// // // //             value={currentCourse.totalSeats}
// // // //             onChange={handleCourseChange}
// // // //             placeholder="Total seats"
// // // //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// // // //           />
// // // //           <input
// // // //             type="number"
// // // //             name="availableSeats"
// // // //             value={currentCourse.availableSeats}
// // // //             onChange={handleCourseChange}
// // // //             placeholder="Available seats"
// // // //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* Operational Days */}
// // // //       <div className="flex flex-col gap-2">
// // // //         <label className="font-medium text-[16px]">Operational Day's</label>
// // // //         <div className="flex flex-wrap gap-2">
// // // //           {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
// // // //             <button
// // // //               key={day}
// // // //               type="button"
// // // //               onClick={() => handleOperationalDayChange(day)}
// // // //               className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
// // // //                 currentCourse.operationalDays.includes(day)
// // // //                   ? "bg-blue-50 border-blue-200 text-blue-700"
// // // //                   : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
// // // //               }`}
// // // //             >
// // // //               {day}
// // // //             </button>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* Operational Times */}
// // // //       <div className="flex flex-col gap-2">
// // // //         <label className="font-medium text-[16px]">Operational Time's</label>
// // // //         <div className="grid grid-cols-2 gap-2">
// // // //           <input
// // // //             type="time"
// // // //             name="openingTime"
// // // //             value={currentCourse.openingTime}
// // // //             onChange={handleCourseChange}
// // // //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// // // //           />
// // // //           <input
// // // //             type="time"
// // // //             name="closingTime"
// // // //             value={currentCourse.closingTime}
// // // //             onChange={handleCourseChange}
// // // //             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       <InputField
// // // //         label="Price of the Seat"
// // // //         name="pricePerSeat"
// // // //         value={currentCourse.pricePerSeat}
// // // //         onChange={handleCourseChange}
// // // //         placeholder="Enter price per seat"
// // // //         type="number"
// // // //       />

// // // //       {/* Upload Image */}
// // // //       <div className="flex flex-col gap-2">
// // // //         <label className="font-medium text-[16px]">Add Image</label>
// // // //         <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
// // // //           <Upload size={24} className="text-gray-400 mb-2" />
// // // //           <span className="text-sm text-gray-500">
// // // //             {currentCourse.image ? (currentCourse.image as File).name : "Upload Course Image (jpg / jpeg)"}
// // // //           </span>
// // // //           <input
// // // //             type="file"
// // // //             accept="image/jpeg,image/jpg"
// // // //             className="hidden"
// // // //             onChange={(e) => handleFileChange(e, "image")}
// // // //           />
// // // //         </label>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import InputField from "@/components/ui/InputField";
// // // import { Upload } from "lucide-react";
// // // import type { Course } from "../../L2DialogBox";

// // // interface TuitionCenterFormProps {
// // //   currentCourse: Course;
// // //   handleCourseChange: (
// // //     e: React.ChangeEvent<
// // //       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
// // //     >
// // //   ) => void;
// // //   handleOperationalDayChange: (day: string) => void;
// // //   handleFileChange: (
// // //     e: React.ChangeEvent<HTMLInputElement>,
// // //     type: "image" | "brochure"
// // //   ) => void;
// // //   setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
// // //   courses: Course[];
// // //   selectedCourseId: number;
// // //   // ✅ 1. Accept an error object for the current course
// // //   courseErrors: Record<string, string>;
// // // }

// // // export default function TuitionCenterForm({
// // //   currentCourse,
// // //   handleCourseChange,
// // //   handleOperationalDayChange,
// // //   handleFileChange,
// // //   courseErrors = {}, // ✅ 2. Destructure with a default value
// // // }: TuitionCenterFormProps) {
// // //   return (
// // //     <div className="grid md:grid-cols-2 gap-6">
// // //       <InputField
// // //         label="Tuition type"
// // //         name="tuitionType"
// // //         value={currentCourse.tuitionType}
// // //         onChange={handleCourseChange}
// // //         isSelect
// // //         options={["Individual", "Group", "Online", "Hybrid"]}
// // //         placeholder="Select tuition type"
// // //         error={courseErrors.tuitionType} // ✅ 3. Display error
// // //       />

// // //       <InputField
// // //         label="Instructor Profile"
// // //         name="instructorProfile"
// // //         value={currentCourse.instructorProfile}
// // //         onChange={handleCourseChange}
// // //         placeholder="Instructor name"
// // //         error={courseErrors.instructorProfile} // ✅ 3. Display error
// // //       />

// // //       <InputField
// // //         label="Subject"
// // //         name="subject"
// // //         value={currentCourse.subject}
// // //         onChange={handleCourseChange}
// // //         placeholder="Enter subject name"
// // //         error={courseErrors.subject} // ✅ 3. Display error
// // //       />

// // //       {/* Seats */}
// // //       <div className="flex flex-col gap-2">
// // //         <label className="font-medium text-[16px]">Seats</label>
// // //         <div className="grid grid-cols-2 gap-2">
// // //           <div>
// // //             <input
// // //               type="number"
// // //               name="totalSeats"
// // //               value={currentCourse.totalSeats}
// // //               onChange={handleCourseChange}
// // //               placeholder="Total seats"
// // //               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
// // //                 courseErrors.totalSeats ? "border-red-500" : "border-gray-300"
// // //               }`}
// // //             />
// // //             {courseErrors.totalSeats && (
// // //               <p className="text-sm text-red-600 mt-1">
// // //                 {courseErrors.totalSeats}
// // //               </p>
// // //             )}
// // //           </div>
// // //           <div>
// // //             <input
// // //               type="number"
// // //               name="availableSeats"
// // //               value={currentCourse.availableSeats}
// // //               onChange={handleCourseChange}
// // //               placeholder="Available seats"
// // //               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
// // //                 courseErrors.availableSeats
// // //                   ? "border-red-500"
// // //                   : "border-gray-300"
// // //               }`}
// // //             />
// // //             {courseErrors.availableSeats && (
// // //               <p className="text-sm text-red-600 mt-1">
// // //                 {courseErrors.availableSeats}
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Operational Days */}
// // //       <div className="flex flex-col gap-2">
// // //         <label className="font-medium text-[16px]">Operational Day's</label>
// // //         <div className="flex flex-wrap gap-2">
// // //           {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
// // //             <button
// // //               key={day}
// // //               type="button"
// // //               onClick={() => handleOperationalDayChange(day)}
// // //               className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
// // //                 currentCourse.operationalDays.includes(day)
// // //                   ? "bg-blue-50 border-blue-200 text-blue-700"
// // //                   : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               {day}
// // //             </button>
// // //           ))}
// // //         </div>
// // //         {courseErrors.operationalDays && (
// // //           <p className="text-sm text-red-600 mt-1">
// // //             {courseErrors.operationalDays}
// // //           </p>
// // //         )}
// // //       </div>

// // //       {/* Operational Times */}
// // //       <div className="flex flex-col gap-2">
// // //         <label className="font-medium text-[16px]">Operational Time's</label>
// // //         <div className="grid grid-cols-2 gap-2">
// // //           <div>
// // //             <input
// // //               type="time"
// // //               name="openingTime"
// // //               value={currentCourse.openingTime}
// // //               onChange={handleCourseChange}
// // //               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
// // //                 courseErrors.openingTime ? "border-red-500" : "border-gray-300"
// // //               }`}
// // //             />
// // //             {courseErrors.openingTime && (
// // //               <p className="text-sm text-red-600 mt-1">
// // //                 {courseErrors.openingTime}
// // //               </p>
// // //             )}
// // //           </div>
// // //           <div>
// // //             <input
// // //               type="time"
// // //               name="closingTime"
// // //               value={currentCourse.closingTime}
// // //               onChange={handleCourseChange}
// // //               className={`w-full px-3 py-2 border rounded-lg bg-white text-sm ${
// // //                 courseErrors.closingTime ? "border-red-500" : "border-gray-300"
// // //               }`}
// // //             />
// // //             {courseErrors.closingTime && (
// // //               <p className="text-sm text-red-600 mt-1">
// // //                 {courseErrors.closingTime}
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <InputField
// // //         label="Price of the Seat"
// // //         name="pricePerSeat"
// // //         value={currentCourse.pricePerSeat}
// // //         onChange={handleCourseChange}
// // //         placeholder="Enter price per seat"
// // //         type="number"
// // //         error={courseErrors.pricePerSeat} // ✅ 3. Display error
// // //       />

// // //       {/* Upload Image */}
// // //       <div className="flex flex-col gap-2">
// // //         <label className="font-medium text-[16px]">Add Image</label>
// // //         <label
// // //           className={`w-full h-[120px] rounded-[12px] border-2 border-dashed bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors ${
// // //             courseErrors.image ? "border-red-500" : "border-[#DADADD]"
// // //           }`}
// // //         >
// // //           <Upload size={24} className="text-gray-400 mb-2" />
// // //           <span className="text-sm text-gray-500">
// // //             {currentCourse.image
// // //               ? (currentCourse.image as File).name
// // //               : "Upload Course Image (jpg / jpeg)"}
// // //           </span>
// // //           <input
// // //             type="file"
// // //             accept="image/jpeg,image/jpg"
// // //             className="hidden"
// // //             onChange={(e) => handleFileChange(e, "image")}
// // //           />
// // //         </label>
// // //         {courseErrors.image && (
// // //           <p className="text-sm text-red-600 mt-1">{courseErrors.image}</p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // // Assuming you have these icons installed from lucide-react
// // import { Upload, User, Book, Building, Clock, IndianRupee } from "lucide-react";
// // import type { Course } from "../../L2DialogBox";
// // import InputField from "@/components/ui/InputField";


// // interface TuitionCenterFormProps {
// //   currentCourse: Course;
// //   handleCourseChange: (
// //     e: React.ChangeEvent<
// //       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
// //     >
// //   ) => void;
// //   handleOperationalDayChange: (day: string) => void;
// //   handleFileChange: (
// //     e: React.ChangeEvent<HTMLInputElement>,
// //     type: "image" | "brochure"
// //   ) => void;
// //   courseErrors: Record<string, string>;
// // }

// // // A helper component for inputs with icons to keep the code clean
// // const IconInput = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
// //   <div className="relative flex items-center">
// //     <span className="absolute left-3 text-gray-400">{icon}</span>
// //     {children}
// //   </div>
// // );


// // export default function TuitionCenterForm({
// //   currentCourse,
// //   handleCourseChange,
// //   handleOperationalDayChange,
// //   handleFileChange,
// //   courseErrors = {},
// // }: TuitionCenterFormProps) {
// //   return (
// //     <div className="grid md:grid-cols-2 gap-6">
// //       <InputField
// //         label="Tuition type"
// //         name="tuitionType"
// //         value={currentCourse.tuitionType}
// //         onChange={handleCourseChange}
// //         isSelect
// //         // ✅ Updated dropdown options
// //         options={["Home Tuition", "Center Tuition"]}
// //         placeholder="Select tuition type"
// //         error={courseErrors.tuitionType}
// //       />

// //       {/* Instructor Profile with Icon */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Instructor Profile *</label>
// //         <IconInput icon={<User size={18} />}>
// //             <input
// //                 name="instructorProfile"
// //                 value={currentCourse.instructorProfile}
// //                 onChange={handleCourseChange}
// //                 placeholder="Instructor name"
// //                 className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                     courseErrors.instructorProfile ? "border-red-500" : "border-gray-300"
// //                 }`}
// //             />
// //         </IconInput>
// //         {courseErrors.instructorProfile && <p className="text-sm text-red-600 mt-1">{courseErrors.instructorProfile}</p>}
// //       </div>

// //       {/* Subject with Icon */}
// //        <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Subject *</label>
// //         <IconInput icon={<Book size={18} />}>
// //              <input
// //                 name="subject"
// //                 value={currentCourse.subject}
// //                 onChange={handleCourseChange}
// //                 placeholder="Enter subject name"
// //                 className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                     courseErrors.subject ? "border-red-500" : "border-gray-300"
// //                 }`}
// //             />
// //         </IconInput>
// //         {courseErrors.subject && <p className="text-sm text-red-600 mt-1">{courseErrors.subject}</p>}
// //       </div>

// //       {/* Total Seats */}
// //       <div className="flex flex-col gap-2">
// //         {/* ✅ Label updated to match image */}
// //         <label className="font-medium text-[16px]">Total Seats *</label>
// //         <div className="grid grid-cols-2 gap-2">
// //           <div>
// //             <IconInput icon={<Building size={18} />}>
// //                 <input
// //                     type="number"
// //                     name="totalSeats"
// //                     value={currentCourse.totalSeats}
// //                     onChange={handleCourseChange}
// //                     placeholder="Total seats"
// //                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                         courseErrors.totalSeats ? "border-red-500" : "border-gray-300"
// //                     }`}
// //                 />
// //             </IconInput>
// //             {courseErrors.totalSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.totalSeats}</p>}
// //           </div>
// //           <div>
// //             <IconInput icon={<Building size={18} />}>
// //                  <input
// //                     type="number"
// //                     name="availableSeats"
// //                     value={currentCourse.availableSeats}
// //                     onChange={handleCourseChange}
// //                     placeholder="Available seats"
// //                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                         courseErrors.availableSeats ? "border-red-500" : "border-gray-300"
// //                     }`}
// //                 />
// //             </IconInput>
// //             {courseErrors.availableSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.availableSeats}</p>}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Operational Days */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Operational Day's *</label>
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
// //         {courseErrors.operationalDays && <p className="text-sm text-red-600 mt-1">{courseErrors.operationalDays}</p>}
// //       </div>

// //       {/* Operational Times */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Operational Time's *</label>
// //         <div className="grid grid-cols-2 gap-2">
// //           <div>
// //             <IconInput icon={<Clock size={18} />}>
// //                 <input
// //                     type="time"
// //                     name="openingTime"
// //                     placeholder="From"
// //                     value={currentCourse.openingTime}
// //                     onChange={handleCourseChange}
// //                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                         courseErrors.openingTime ? "border-red-500" : "border-gray-300"
// //                     }`}
// //                 />
// //             </IconInput>
// //             {courseErrors.openingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.openingTime}</p>}
// //           </div>
// //           <div>
// //             <IconInput icon={<Clock size={18} />}>
// //                  <input
// //                     type="time"
// //                     name="closingTime"
// //                     placeholder="To"
// //                     value={currentCourse.closingTime}
// //                     onChange={handleCourseChange}
// //                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                         courseErrors.closingTime ? "border-red-500" : "border-gray-300"
// //                     }`}
// //                 />
// //             </IconInput>
// //             {courseErrors.closingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.closingTime}</p>}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Price of the Seat with Rupee Icon */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Price of the Seat *</label>
// //         <IconInput icon={<IndianRupee size={18} />}>
// //             <input
// //                 type="number"
// //                 name="pricePerSeat"
// //                 value={currentCourse.pricePerSeat}
// //                 onChange={handleCourseChange}
// //                 placeholder="Enter price per seat"
// //                 className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
// //                     courseErrors.pricePerSeat ? "border-red-500" : "border-gray-300"
// //                 }`}
// //             />
// //         </IconInput>
// //         {courseErrors.pricePerSeat && <p className="text-sm text-red-600 mt-1">{courseErrors.pricePerSeat}</p>}
// //       </div>

// //       {/* Upload Image */}
// //       <div className="flex flex-col gap-2">
// //         <label className="font-medium text-[16px]">Add Image *</label>
// //         <label
// //           className={`w-full h-[120px] rounded-[12px] border-2 border-dashed bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors ${
// //             courseErrors.image ? "border-red-500" : "border-[#DADADD]"
// //           }`}
// //         >
// //           <Upload size={24} className="text-gray-400 mb-2" />
// //           <span className="text-sm text-gray-500">
// //             {currentCourse.image
// //               ? (currentCourse.image as File).name
// //               : "Upload Course Image (jpg / jpeg)"}
// //           </span>
// //           <input
// //             type="file"
// //             name="image"
// //             accept="image/jpeg,image/jpg"
// //             className="hidden"
// //             onChange={(e) => handleFileChange(e, "image")}
// //             required
// //           />
// //         </label>
// //         {courseErrors.image && <p className="text-sm text-red-600 mt-1">{courseErrors.image}</p>}
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// // Assuming you have these icons installed from lucide-react
// import { Upload, User, Book, Building, Clock, IndianRupee } from "lucide-react";
// import type { Course } from "../../L2DialogBox";
// import InputField from "@/components/ui/InputField";


// interface TuitionCenterFormProps {
//   currentCourse: Course;
//   handleCourseChange: (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => void;
//   handleOperationalDayChange: (day: string) => void;
//   handleFileChange: (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "image" | "brochure"
//   ) => void;
//   courseErrors: Record<string, string>;
// }

// // A helper component for inputs with icons to keep the code clean
// const IconInput = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
//   <div className="relative flex items-center">
//     <span className="absolute left-3 text-gray-400">{icon}</span>
//     {children}
//   </div>
// );


// export default function TuitionCenterForm({
//   currentCourse,
//   handleCourseChange,
//   handleOperationalDayChange,
//   handleFileChange,
//   courseErrors = {},
// }: TuitionCenterFormProps) {
//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       <InputField
//         label="Tuition type"
//         name="tuitionType"
//         value={currentCourse.tuitionType}
//         onChange={handleCourseChange}
//         isSelect
        
//         // ✅ Updated dropdown options
//         options={["Home Tuition", "Center Tuition"]}
//         placeholder="Select tuition type"
//         error={courseErrors.tuitionType}
//         required
//       />

//       {/* Instructor Profile with Icon */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Instructor Profile<span className="text-red-500 ml-1">*</span></label>
//         <IconInput icon={<User size={18} />}>
//             <input
//                 name="instructorProfile"
//                 value={currentCourse.instructorProfile}
//                 onChange={handleCourseChange}
//                 placeholder="Instructor name"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                     courseErrors.instructorProfile ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//         </IconInput>
//         {courseErrors.instructorProfile && <p className="text-sm text-red-600 mt-1">{courseErrors.instructorProfile}</p>}
//       </div>

//       {/* Subject with Icon */}
//        <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Subject<span className="text-red-500 ml-1">*</span></label>
//         <IconInput icon={<Book size={18} />}>
//              <input
//                 name="subject"
//                 value={currentCourse.subject}
//                 onChange={handleCourseChange}
//                 placeholder="Enter subject name"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                     courseErrors.subject ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//         </IconInput>
//         {courseErrors.subject && <p className="text-sm text-red-600 mt-1">{courseErrors.subject}</p>}
//       </div>

//       {/* Total Seats */}
//       <div className="flex flex-col gap-2">
//         {/* ✅ Label updated to match image */}
//         <label className="font-medium text-[16px]">Total Seats<span className="text-red-500 ml-1">*</span></label>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <IconInput icon={<Building size={18} />}>
//                 <input
//                     type="number"
//                     name="totalSeats"
//                     value={currentCourse.totalSeats}
//                     onChange={handleCourseChange}
//                     placeholder="Total seats"
//                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                         courseErrors.totalSeats ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//             </IconInput>
//             {courseErrors.totalSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.totalSeats}</p>}
//           </div>
//           <div>
//             <IconInput icon={<Building size={18} />}>
//                  <input
//                     type="number"
//                     name="availableSeats"
//                     value={currentCourse.availableSeats}
//                     onChange={handleCourseChange}
//                     placeholder="Available seats"
//                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                         courseErrors.availableSeats ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//             </IconInput>
//             {courseErrors.availableSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.availableSeats}</p>}
//           </div>
//         </div>
//       </div>

//       {/* Operational Days */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Operational Day's<span className="text-red-500 ml-1">*</span></label>
//         <div className="flex flex-wrap gap-2">
//           {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
//             <button
//               key={day}
//               type="button"
//               onClick={() => handleOperationalDayChange(day)}
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

//       {/* Operational Times */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Operational Time's<span className="text-red-500 ml-1">*</span></label>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <IconInput icon={<Clock size={18} />}>
//                 <input
//                     type="time"
//                     name="openingTime"
//                     placeholder="From"
//                     value={currentCourse.openingTime}
//                     onChange={handleCourseChange}
//                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                         courseErrors.openingTime ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//             </IconInput>
//             {courseErrors.openingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.openingTime}</p>}
//           </div>
//           <div>
//             <IconInput icon={<Clock size={18} />}>
//                  <input
//                     type="time"
//                     name="closingTime"
//                     placeholder="To"
//                     value={currentCourse.closingTime}
//                     onChange={handleCourseChange}
//                     className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                         courseErrors.closingTime ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//             </IconInput>
//             {courseErrors.closingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.closingTime}</p>}
//           </div>
//         </div>
//       </div>

//       {/* Price of the Seat with Rupee Icon */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Price of the Seat<span className="text-red-500 ml-1">*</span></label>
//         <IconInput icon={<IndianRupee size={18} />}>
//             <input
//                 type="number"
//                 name="pricePerSeat"
//                 value={currentCourse.pricePerSeat}
//                 onChange={handleCourseChange}
//                 placeholder="Enter price per seat"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
//                     courseErrors.pricePerSeat ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//         </IconInput>
//         {courseErrors.pricePerSeat && <p className="text-sm text-red-600 mt-1">{courseErrors.pricePerSeat}</p>}
//       </div>

//       {/* Upload Image */}
//       <div className="flex flex-col gap-2">
//         <label className="font-medium text-[16px]">Add Image </label>
//         <label
//           className={`w-full h-[120px] rounded-[12px] border-2 border-dashed bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors ${
//             courseErrors.image ? "border-red-500" : "border-[#DADADD]"
//           }`}
//         >
//           <Upload size={24} className="text-gray-400 mb-2" />
//           <span className="text-sm text-gray-500">
//             {currentCourse.image
//               ? (currentCourse.image as File).name
//               : "Upload Course Image (jpg / jpeg)"}
//           </span>
//           <input
//             type="file"
//             name="image"
//             accept="image/jpeg,image/jpg"
//             className="hidden"
//             onChange={(e) => handleFileChange(e, "image")}
//           />
//         </label>
//         {courseErrors.image && <p className="text-sm text-red-600 mt-1">{courseErrors.image}</p>}
//       </div>
//     </div>
//   );
// }

"use client";

// Assuming you have these icons installed from lucide-react
import { Upload, User, Book, Building, Clock, IndianRupee } from "lucide-react";
import type { Course } from "../../L2DialogBox";
// InputField is no longer used for this specific form, but kept in case other forms need it
import InputField from "@/components/ui/InputField";
import { Dispatch, SetStateAction } from "react";


interface TuitionCenterFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleOperationalDayChange: (day: string) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "brochure"
  ) => void;
  courseErrors: Record<string, string>;
  // ✅ ADD THESE MISSING PROPS BACK
  setCourses: Dispatch<SetStateAction<Course[]>>;
  courses: Course[];
  selectedCourseId: number;
}

// A helper component for inputs with icons to keep the code clean
const IconInput = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="relative flex items-center">
    <span className="absolute left-3 text-gray-400">{icon}</span>
    {children}
  </div>
);




export default function TuitionCenterForm({
  currentCourse,
  handleCourseChange,
  handleOperationalDayChange,
  handleFileChange,
  courseErrors = {},
  
}: TuitionCenterFormProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* ✅ MODIFICATION: Replaced InputField with a styled <select> for consistent width */}
     {/* Wrapper for the custom styled dropdown */}
      <InputField
  label="Tuition type"
  name="tuitionType"
  value={currentCourse.tuitionType}
  onChange={handleCourseChange}
  isSelect
  options={["Home Tuition", "Center Tuition"]}
  placeholder="Select tuition type"
  required
  error={courseErrors.tuitionType}
/>


      {/* Instructor Profile with Icon */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Instructor Profile<span className="text-red-500 ml-1">*</span></label>
        <IconInput icon={<User size={18} />}>
            <input
                name="instructorProfile"
                value={currentCourse.instructorProfile}
                onChange={handleCourseChange}
                placeholder="Instructor name"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                    courseErrors.instructorProfile ? "border-red-500" : "border-gray-300"
                }`}
            />
        </IconInput>
        {courseErrors.instructorProfile && <p className="text-sm text-red-600 mt-1">{courseErrors.instructorProfile}</p>}
      </div>

      {/* Subject with Icon */}
       <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Subject<span className="text-red-500 ml-1">*</span></label>
        <IconInput icon={<Book size={18} />}>
             <input
                name="subject"
                value={currentCourse.subject}
                onChange={handleCourseChange}
                placeholder="Enter subject name"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                    courseErrors.subject ? "border-red-500" : "border-gray-300"
                }`}
            />
        </IconInput>
        {courseErrors.subject && <p className="text-sm text-red-600 mt-1">{courseErrors.subject}</p>}
      </div>

      {/* Total Seats */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Total Seats<span className="text-red-500 ml-1">*</span></label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <IconInput icon={<Building size={18} />}>
                <input
                    type="number"
                    name="totalSeats"
                    value={currentCourse.totalSeats}
                    onChange={handleCourseChange}
                    placeholder="Total seats"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                        courseErrors.totalSeats ? "border-red-500" : "border-gray-300"
                    }`}
                />
            </IconInput>
            {courseErrors.totalSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.totalSeats}</p>}
          </div>
          <div>
            <IconInput icon={<Building size={18} />}>
                 <input
                    type="number"
                    name="availableSeats"
                    value={currentCourse.availableSeats}
                    onChange={handleCourseChange}
                    placeholder="Available seats"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                        courseErrors.availableSeats ? "border-red-500" : "border-gray-300"
                    }`}
                />
            </IconInput>
            {courseErrors.availableSeats && <p className="text-sm text-red-600 mt-1">{courseErrors.availableSeats}</p>}
          </div>
        </div>
      </div>

      {/* Operational Days */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Operational Day's<span className="text-red-500 ml-1">*</span></label>
        <div className="flex flex-wrap gap-2">
          {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleOperationalDayChange(day)}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                currentCourse.operationalDays.includes(day)
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {courseErrors.operationalDays && <p className="text-sm text-red-600 mt-1">{courseErrors.operationalDays}</p>}
      </div>

      {/* Operational Times */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Operational Time's<span className="text-red-500 ml-1">*</span></label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <IconInput icon={<Clock size={18} />}>
                <input
                    type="time"
                    name="openingTime"
                    placeholder="From"
                    value={currentCourse.openingTime}
                    onChange={handleCourseChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                        courseErrors.openingTime ? "border-red-500" : "border-gray-300"
                    }`}
                />
            </IconInput>
            {courseErrors.openingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.openingTime}</p>}
          </div>
          <div>
            <IconInput icon={<Clock size={18} />}>
                 <input
                    type="time"
                    name="closingTime"
                    placeholder="To"
                    value={currentCourse.closingTime}
                    onChange={handleCourseChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                        courseErrors.closingTime ? "border-red-500" : "border-gray-300"
                    }`}
                />
            </IconInput>
            {courseErrors.closingTime && <p className="text-sm text-red-600 mt-1">{courseErrors.closingTime}</p>}
          </div>
        </div>
      </div>

      {/* Price of the Seat with Rupee Icon */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Price of the Seat<span className="text-red-500 ml-1">*</span></label>
        <IconInput icon={<IndianRupee size={18} />}>
            <input
                type="number"
                name="pricePerSeat"
                value={currentCourse.pricePerSeat}
                onChange={handleCourseChange}
                placeholder="Enter price per seat"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm ${
                    courseErrors.pricePerSeat ? "border-red-500" : "border-gray-300"
                }`}
            />
        </IconInput>
        {courseErrors.pricePerSeat && <p className="text-sm text-red-600 mt-1">{courseErrors.pricePerSeat}</p>}
      </div>

      {/* Upload Image */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Add Image<span className="text-red-500 ml-1">*</span></label>
        <label
          className={`w-full h-[120px] rounded-[12px] border-2 border-dashed bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors ${
            courseErrors.image ? "border-red-500" : "border-[#DADADD]"
          }`}
        >
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            {currentCourse.image
              ? (currentCourse.image as File).name
              : "Upload Course Image (jpg / jpeg)"}
          </span>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => handleFileChange(e, "image")}
          />
        </label>
        {courseErrors.image && <p className="text-sm text-red-600 mt-1">{courseErrors.image}</p>}
      </div>
    </div>
  );
}