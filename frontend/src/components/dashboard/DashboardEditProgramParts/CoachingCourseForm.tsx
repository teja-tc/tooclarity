"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";

interface CoachingCenterFormProps {
  formData: any;
  formErrors: Record<string, string>;
  handleFieldChange: (name: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onPrevious: () => void;
}

export default function CoachingCenterForm({
  formData,
  formErrors,
  handleFieldChange,
  handleSubmit,
  isLoading,
  onPrevious,
}: CoachingCenterFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- Section 1: Course Details --- */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold">Course Details</h3>
        <p className="text-[#697282] text-sm mt-1">
          Define the specifics of the course you are offering.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
        <InputField
          label="Categories type"
          name="categoriesType"
          value={formData.categoriesType || ''}
          // ✅ FIX: Type removed from (e)
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Academic", "Competitive Exam", "Professional", "Skill Development", "Language", "Arts & Crafts", "Sports", "Music & Dance"]}
          placeholder="Select Categories type"
          error={formErrors.categoriesType}
          required
        />
        <InputField
          label="Domain type"
          name="domainType"
          value={formData.domainType || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Engineering", "Medical", "Management", "Law", "Banking", "Government Jobs", "IT & Software", "Design", "Marketing", "Finance"]}
          placeholder="Select domain type"
          error={formErrors.domainType}
          required
        />
        <InputField
          label="Course name"
          name="courseName"
          value={formData.courseName || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter course name"
          error={formErrors.courseName}
          required
        />
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">Mode</label>
          <SlidingIndicator
            options={["Offline", "Online", "Hybrid"] as const}
            activeOption={formData.mode}
            onOptionChange={(mode: string) => handleFieldChange("mode", mode)}
            size="md"
          />
          {formErrors.mode && <p className="text-sm text-red-600">{formErrors.mode}</p>}
        </div>
        <InputField
          label="Course Duration"
          name="courseDuration"
          value={formData.courseDuration || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="e.g, 3 months"
          error={formErrors.courseDuration}
          required
        />
        <InputField
          label="Price of Course"
          name="priceOfCourse"
          value={formData.priceOfCourse || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter Course price"
          type="number"
          error={formErrors.priceOfCourse}
          required
        />
        <InputField
          label="Location"
          name="location"
          value={formData.location || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter a valid URL (e.g., https://...)"
          error={formErrors.location}
          required
        />
        <InputField
          label="Class size"
          name="classSize"
          value={formData.classSize || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter no of students per class"
          type="number"
          error={formErrors.classSize}
        />
      </div>

      {/* --- Section 2: Institute Facilities & Placements --- */}
      <div className="space-y-4 border-t pt-8">
        <h3 className="text-xl md:text-2xl font-bold">Institute Facilities</h3>
        <p className="text-[#697282] text-sm">
          Highlight the placement support and certifications you provide.
        </p>
        <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Placement drives ?"
                name="placementDrives"
                value={formData.placementDrives}
                onChange={(e) => handleFieldChange("placementDrives", e.target.value)}
                isRadio
                options={["Yes", "No"]}
                error={formErrors.placementDrives}
                required
              />
              <InputField
                label="Mock interviews ?"
                name="mockInterviews"
                value={formData.mockInterviews}
                onChange={(e) => handleFieldChange("mockInterviews", e.target.value)}
                isRadio
                options={["Yes", "No"]}
                error={formErrors.mockInterviews}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Resume building ?"
                name="resumeBuilding"
                value={formData.resumeBuilding}
                onChange={(e) => handleFieldChange("resumeBuilding", e.target.value)}
                isRadio
                options={["Yes", "No"]}
                error={formErrors.resumeBuilding}
                required
              />
              <InputField
                label="LinkedIn optimization ?"
                name="linkedinOptimization"
                value={formData.linkedinOptimization}
                onChange={(e) => handleFieldChange("linkedinOptimization", e.target.value)}
                isRadio
                options={["Yes", "No"]}
                error={formErrors.linkedinOptimization}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Access to exclusive job portal ?"
                name="exclusiveJobPortal"
                value={formData.exclusiveJobPortal}
                onChange={(e) => handleFieldChange("exclusiveJobPortal", e.target.value)}
                isRadio
                options={["Yes", "No"]}
                error={formErrors.exclusiveJobPortal}
                required
              />
              <InputField
                label="Certification ?"
                name="certification"
                value={formData.certification}
                onChange={(e) => handleFieldChange("certification", e.target.value)}
                isRadio
                options={["Yes", "No"]}
                error={formErrors.certification}
                required
              />
            </div>
        </div>
      </div>

      {/* --- Form Actions --- */}
       <div className="flex justify-center pt-6 gap-10">
           
             <Button
               type="submit"
               disabled={isLoading}
               className="w-[314px] h-[48px] bg-[#697282] text-[#F5F6F9] rounded-[12px] font-semibold text-[18px] flex items-center justify-center hover:bg-[#5b626f] transition-colors"
             >
               {isLoading ? "Saving..." : "Save Changes"}
             </Button>
           </div>
    </form>
  );
}