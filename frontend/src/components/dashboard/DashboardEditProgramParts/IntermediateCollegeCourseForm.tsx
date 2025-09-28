"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";

export default function IntermediateCollegeCourseForm({
  formData,
  formErrors,
  handleFieldChange,
  handleOperationalDayToggle,
  operationalDaysOptions,
  handleSubmit,
  isLoading,
}: any) {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Course & College Details</h3>
        <p className="text-[#697282] text-sm">
          Fill in the details for your course and college information.
        </p>
      </div>

      {/* === Course Info === */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Course Name"
          name="courseName"
          value={formData.courseName || ''}
          // ✅ FIX: Remove the explicit type from (e)
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter Course name"
          error={formErrors.courseName}
          required
        />
        <InputField
          label="About Course"
          name="aboutCourse"
          value={formData.aboutCourse || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter the course info"
          error={formErrors.aboutCourse}
          required
        />
        <InputField
          label="Course Duration"
          name="courseDuration"
          value={formData.courseDuration || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="e.g., 3 months"
          error={formErrors.courseDuration}
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
          {formErrors.mode && (
            <p className="text-sm text-red-600 mt-1">{formErrors.mode}</p>
          )}
        </div>
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
          placeholder="Enter Place name"
          error={formErrors.location}
          required
        />
      </div>

      {/* === College Info === */}
      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
        <InputField
          label="College Type"
          name="collegeType"
          value={formData.collegeType || ''}
          // ✅ FIX: Remove the explicit type from (e)
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Junior College", "Senior Secondary", "Higher Secondary", "Intermediate", "Pre-University"]}
          placeholder="Select college type"
          error={formErrors.collegeType}
          required
        />
        <InputField
          label="College Category"
          name="collegeCategory"
          value={formData.collegeCategory || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Government", "Private", "Semi-Government", "Aided", "Unaided"]}
          placeholder="Select college category"
          error={formErrors.collegeCategory}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Curriculum Type"
          name="curriculumType"
          value={formData.curriculumType || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["State Board", "CBSE", "ICSE", "IB", "Cambridge", "Other"]}
          placeholder="Select Curriculum type"
          error={formErrors.curriculumType}
          required
        />
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">
            Operational Days <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {(operationalDaysOptions || []).map((day: string) => (
              <Button
                key={day}
                type="button"
                onClick={() => handleOperationalDayToggle(day)}
                className={`h-12 px-2 rounded-lg border text-sm ${
                  formData.operationalDays?.includes(day)
                    ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day}
              </Button>
            ))}
          </div>
          {formErrors.operationalDays && (
            <p className="text-red-500 text-xs mt-1">{formErrors.operationalDays}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Other Activities"
          name="otherActivities"
          value={formData.otherActivities || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter activities"
          error={formErrors.otherActivities}
          required
        />
        <InputField
          label="Hostel Facility?"
          name="hostelFacility"
          value={formData.hostelFacility || ''}
          onChange={(e) => handleFieldChange("hostelFacility", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.hostelFacility}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Playground?"
          name="playground"
          value={formData.playground || ''}
          onChange={(e) => handleFieldChange("playground", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.playground}
          required
        />
        <InputField
          label="Bus Service?"
          name="busService"
          value={formData.busService || ''}
          onChange={(e) => handleFieldChange("busService", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.busService}
          required
        />
      </div>

      {/* === Actions === */}
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