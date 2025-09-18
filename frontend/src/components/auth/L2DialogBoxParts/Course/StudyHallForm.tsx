"use client";

import InputField from "@/components/ui/InputField";
import { Upload } from "lucide-react";
import type { Course } from "../../L2DialogBox";

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
}

export default function StudyHallForm({
  currentCourse,
  handleCourseChange,
  handleOperationalDayChange,
  handleFileChange,
}: StudyHallFormProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <InputField
        label="Seating option"
        name="seatingOption"
        value={currentCourse.seatingOption}
        onChange={handleCourseChange}
        isSelect
        options={["Individual Desk", "Shared Table", "Private Cabin", "Open Seating"]}
        placeholder="Select seating option"
      />

      {/* Opening & Closing Time */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Operational Time's</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            name="openingTime"
            value={currentCourse.openingTime}
            onChange={handleCourseChange}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          />
          <input
            type="time"
            name="closingTime"
            value={currentCourse.closingTime}
            onChange={handleCourseChange}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          />
        </div>
      </div>

      {/* Operational Days */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Operational Day's</label>
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
      </div>

      {/* Seats */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Total Seats</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="totalSeats"
            value={currentCourse.totalSeats}
            onChange={handleCourseChange}
            placeholder="Total seats"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          />
          <input
            type="number"
            name="availableSeats"
            value={currentCourse.availableSeats}
            onChange={handleCourseChange}
            placeholder="Available seats"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          />
        </div>
      </div>

      <InputField
        label="Price of the Seat"
        name="pricePerSeat"
        value={currentCourse.pricePerSeat}
        onChange={handleCourseChange}
        placeholder="Enter price per seat"
        type="number"
      />

      {/* Upload Image */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-[16px]">Add Image</label>
        <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            {currentCourse.image ? (currentCourse.image as File).name : "Upload Course Image (jpg / jpeg)"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => handleFileChange(e, "image")}
          />
        </label>
      </div>

      {/* Facilities */}
      {[
        { name: "hasWifi", label: "Wi-fi ?" },
        { name: "hasChargingPoints", label: "Charging Points ?" },
        { name: "hasAC", label: "Air Conditioner (AC) ?" },
        { name: "hasPersonalLocker", label: "Personal Locker's ?" },
      ].map((f) => (
        <div key={f.name} className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">{f.label}</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name={f.name} value="yes" checked={(currentCourse as any)[f.name] === true} readOnly />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name={f.name} value="no" checked={(currentCourse as any)[f.name] === false} readOnly />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
