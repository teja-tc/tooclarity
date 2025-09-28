

"use client";

import React from "react";
import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ 1. A single interface for the form data, matching the parent state
export interface KindergartenCourseFormData {
  _id?: string;
  courseName?: string;
  aboutCourse?: string;
  courseDuration?: string;
  mode?: "Offline" | "Online" | "Hybrid";
  priceOfCourse?: number | string;
  location?: string;
  schoolType?: string;
  curriculumType?: string;
  openingTime?: string;
  closingTime?: string;
  operationalDays?: string[];
  extendedCare?: "Yes" | "No";
  mealsProvided?: "Yes" | "No";
  outdoorPlayArea?: "Yes" | "No";
}

// ✅ 2. A simplified props interface
interface KindergartenCourseFormProps {
  formData: Partial<KindergartenCourseFormData>;
  formErrors?: Record<string, string>;
  handleFieldChange: (name: string, value: any) => void;
  handleOperationalDayToggle: (day: string) => void;
  operationalDaysOptions: string[];
  handleSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function KindergartenCourseForm({
  formData,
  formErrors = {},
  handleFieldChange,
  handleOperationalDayToggle,
  operationalDaysOptions = [],
  handleSubmit,
  isLoading = false,
}: KindergartenCourseFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl md:text-2xl font-bold">Editing Kindergarten Program</h3>

      {/* ====== Common Course Fields ====== */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Program Name"
          name="courseName"
          value={formData.courseName || ""}
          onChange={(e) => handleFieldChange("courseName", e.target.value)}
          placeholder="Enter Program name"
          error={formErrors.courseName}
          required
        />

        <InputField
          label="About Program"
          name="aboutCourse"
          value={formData.aboutCourse || ""}
          onChange={(e) => handleFieldChange("aboutCourse", e.target.value)}
          placeholder="Enter the program info"
          error={formErrors.aboutCourse}
          as="textarea"
          rows={3}
          required
        />

        <InputField
          label="Program Duration"
          name="courseDuration"
          value={formData.courseDuration || ""}
          onChange={(e) => handleFieldChange("courseDuration", e.target.value)}
          placeholder="e.g, 3 months"
          error={formErrors.courseDuration}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">Mode</label>
          <SlidingIndicator
            options={["Offline", "Online", "Hybrid"] as const}
            activeOption={formData.mode || "Offline"}
            onOptionChange={(mode) => handleFieldChange('mode', mode)}
            size="md"
          />
          {formErrors.mode && <p className="text-sm text-red-600 mt-1">{formErrors.mode}</p>}
        </div>

        <InputField
          label="Price of Program"
          name="priceOfCourse"
          value={String(formData.priceOfCourse || "")}
          onChange={(e) => handleFieldChange("priceOfCourse", e.target.value)}
          placeholder="Enter Program price"
          type="number"
          error={formErrors.priceOfCourse}
          required
        />

        <InputField
          label="Location"
          name="location"
          value={formData.location || ""}
          onChange={(e) => handleFieldChange("location", e.target.value)}
          placeholder="Enter Place name"
          error={formErrors.location}
          required
        />
      </div>

      {/* ====== Kindergarten Fields ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <InputField
          label="School type"
          name="schoolType"
          value={formData.schoolType || ""}
          onChange={(e) => handleFieldChange("schoolType", e.target.value)}
          isSelect
          options={["Public", "Private (For-profit)", "Private (Non-profit)", "International", "Home - based"]}
          placeholder="Select school type"
          error={formErrors.schoolType}
          required
        />

        <InputField
          label="Curriculum type"
          name="curriculumType"
          value={formData.curriculumType || ""}
          onChange={(e) => handleFieldChange("curriculumType", e.target.value)}
          placeholder="Enter Curriculum type"
          error={formErrors.curriculumType}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operational Times */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">Operational Times *</label>
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label=""
              name="openingTime"
              type="time"
              value={formData.openingTime || ""}
              onChange={(e) => handleFieldChange("openingTime", e.target.value)}
              icon={<Clock size={18} />}
              error={formErrors.openingTime}
            />
            <InputField
              label=""
              name="closingTime"
              type="time"
              value={formData.closingTime || ""}
              onChange={(e) => handleFieldChange("closingTime", e.target.value)}
              icon={<Clock size={18} />}
              error={formErrors.closingTime}
            />
          </div>
        </div>

        {/* Operational Days */}
        <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px]">Operational Days *</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {operationalDaysOptions.map((day) => (
                    <Button
                        key={day}
                        type="button"
                        onClick={() => handleOperationalDayToggle(day)}
                        className={`h-[48px] px-3 rounded-[8px] border text-sm transition-colors ${
                            formData.operationalDays?.includes(day)
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {day.substring(0, 3)}
                    </Button>
                ))}
            </div>
            {formErrors.operationalDays && (<p className="text-red-500 text-sm">{formErrors.operationalDays}</p>)}
        </div>
      </div>

      {/* Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Extended care?"
          name="extendedCare"
          value={formData.extendedCare || "No"}
          onChange={(e) => handleFieldChange("extendedCare", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.extendedCare}
          required
        />
        <InputField
          label="Meals Provided?"
          name="mealsProvided"
          value={formData.mealsProvided || "No"}
          onChange={(e) => handleFieldChange("mealsProvided", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.mealsProvided}
          required
        />
        <InputField
          label="Outdoor Play area?"
          name="outdoorPlayArea"
          value={formData.outdoorPlayArea || "No"}
          onChange={(e) => handleFieldChange("outdoorPlayArea", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.outdoorPlayArea}
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-16 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}