"use client";

import React from "react";
import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
import { Button } from "@/components/ui/button";

// A single interface defining all data for the school form
export interface SchoolCourseFormData {
  _id?: string;
  // Common course fields
  courseName?: string;
  aboutCourse?: string;
  courseDuration?: string;
  mode?: "Offline" | "Online" | "Hybrid";
  priceOfCourse?: number | string;
  location?: string;
  // School-specific fields from your schema
  schoolType?: string;
  schoolCategory?: string;
  curriculumType?: string;
  operationalDays?: string[];
  otherActivities?: string;
  hostelFacility?: "Yes" | "No";
  playground?: "Yes" | "No";
  busService?: "Yes" | "No";
}

// A single, simplified props interface
interface SchoolCourseFormProps {
  formData: Partial<SchoolCourseFormData>;
  formErrors?: Record<string, string>;
  handleFieldChange: (name: string, value: any) => void;
  handleOperationalDayToggle: (day: string) => void;
  operationalDaysOptions: string[];
  handleSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  onPrevious?: () => void;
}

export default function SchoolCourseForm({
  formData,
  formErrors = {},
  handleFieldChange,
  handleOperationalDayToggle,
  operationalDaysOptions = [],
  handleSubmit,
  isLoading = false,
  onPrevious,
}: SchoolCourseFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Editing School Program</h3>
        <p className="text-[#697282] text-sm">
          Update the general program details and the specific features of this school.
        </p>
      </div>

      {/* ====== Common Course Fields ====== */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Program Name" name="courseName" value={formData.courseName || ''} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} error={formErrors.courseName} required />
        <InputField as="textarea" rows={3} label="About Program" name="aboutCourse" value={formData.aboutCourse || ''} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} error={formErrors.aboutCourse} required />
        <InputField label="Program Duration" name="courseDuration" value={formData.courseDuration || ''} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} error={formErrors.courseDuration} required />
        
        <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px]">Mode</label>
            <SlidingIndicator options={["Offline", "Online", "Hybrid"] as const} activeOption={formData.mode || "Offline"} onOptionChange={(mode) => handleFieldChange('mode', mode)} size="md" />
            {formErrors.mode && <p className="text-sm text-red-600 mt-1">{formErrors.mode}</p>}
        </div>

        <InputField label="Price" name="priceOfCourse" type="number" value={formData.priceOfCourse || ''} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} error={formErrors.priceOfCourse} required />
        <InputField label="Location URL" name="location" value={formData.location || ''} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} error={formErrors.location} required />
      </div>

      {/* ====== School-Specific Fields ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <InputField label="School Type" name="schoolType" value={formData.schoolType || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} isSelect options={["Co-ed", "Boys Only", "Girls Only"]} placeholder="Select school type" error={formErrors.schoolType} required />
        <InputField label="School Category" name="schoolCategory" value={formData.schoolCategory || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} isSelect options={["Public", "Private", "Charter", "International"]} placeholder="Select category" error={formErrors.schoolCategory} required />
        <InputField label="Curriculum" name="curriculumType" value={formData.curriculumType || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} isSelect options={["State Board", "CBSE", "ICSE", "IB", "IGCSE"]} placeholder="Select curriculum" error={formErrors.curriculumType} required />
        
       <div className="flex flex-col gap-2">
    <label className="font-medium text-[16px]">Operational Days</label>
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {operationalDaysOptions.map((day: string) => (
            <Button 
                key={day} 
                type="button" 
                onClick={() => handleOperationalDayToggle(day)} 
                className={`h-[48px] px-3 rounded-[8px] border text-sm transition-colors ${
                    formData.operationalDays?.includes(day) 
                        // Active State (with hover)
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        // Inactive State (with hover)
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
                {day}
            </Button>
        ))}
    </div>
    {formErrors.operationalDays && (<p className="text-red-500 text-sm">{formErrors.operationalDays}</p>)}
</div>
      </div>

    {/* ====== Other Activities + Hostel in one row ====== */}
<div className="grid md:grid-cols-2 gap-6 mt-4">
  {/* Left: Other Activities */}
  <InputField
    label="Other Activities"
    name="otherActivities"
    as="textarea"
    rows={4}
    value={formData.otherActivities || ""}
    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
    placeholder="e.g., Sports, Arts, Music"
    error={formErrors.otherActivities}
  />

  {/* Right: Hostel Facility */}
  <InputField
    label="Hostel Facility?"
    name="hostelFacility"
    value={formData.hostelFacility || "No"}
    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
    isRadio
    options={["Yes", "No"]}
    error={formErrors.hostelFacility}
    required
  />
</div>

{/* ====== Playground + Bus in next row ====== */}
<div className="grid md:grid-cols-2 gap-6 mt-4">
  <InputField
    label="Playground?"
    name="playground"
    value={formData.playground || "No"}
    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
    isRadio
    options={["Yes", "No"]}
    error={formErrors.playground}
    required
  />

  <InputField
    label="Bus Service?"
    name="busService"
    value={formData.busService || "No"}
    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
    isRadio
    options={["Yes", "No"]}
    error={formErrors.busService}
    required
  />
</div>


      {/* ====== Buttons ====== */}
      <div className="flex flex-col sm:flex-row justify-center pt-6 gap-4 sm:gap-10">
        <Button type="submit" disabled={isLoading} className="w-full md:w-[314px] h-[48px] bg-[#697282] text-white rounded-[12px] font-semibold text-[18px]">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}