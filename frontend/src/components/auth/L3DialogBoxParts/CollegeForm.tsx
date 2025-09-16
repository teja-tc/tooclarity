"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

export default function CollegeForm({
  collegeFormData,
  collegeFormErrors,
  handleCollegeFieldChange,
  handleCollegeRadioChangeWithValidation,
  handleCollegeOperationalDayToggle,
  operationalDaysOptions,
  handleCollegeSubmit,
  isLoading,
  onPrevious,
}: any) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your College.</h3>
        <p className="text-[#697282] text-sm">
          Share the key facts that make students and parents choose you.
        </p>
      </div>

      <form onSubmit={handleCollegeSubmit} className="space-y-6">
        {/* Row 1: College Type and College Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="College type"
            name="collegeType"
            value={collegeFormData.collegeType}
            onChange={handleCollegeFieldChange}
            isSelect
            options={[
              "Junior College",
              "Senior Secondary",
              "Higher Secondary",
              "Intermediate",
              "Pre-University",
            ]}
            placeholder="Select college type"
            error={collegeFormErrors.collegeType}
            required
          />

          <InputField
            label="College category"
            name="collegeCategory"
            value={collegeFormData.collegeCategory}
            onChange={handleCollegeFieldChange}
            isSelect
            options={[
              "Government",
              "Private",
              "Semi-Government",
              "Aided",
              "Unaided",
            ]}
            placeholder="Select college category"
            error={collegeFormErrors.collegeCategory}
            required
          />
        </div>

        {/* Row 2: Curriculum Type and Operational Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Curriculum type"
            name="curriculumType"
            value={collegeFormData.curriculumType}
            onChange={handleCollegeFieldChange}
            isSelect
            options={[
              "State Board",
              "CBSE",
              "ICSE",
              "IB",
              "Cambridge",
              "Other",
            ]}
            placeholder="Select Curriculum type"
            error={collegeFormErrors.curriculumType}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
              Operational Day's <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {operationalDaysOptions.map((day: string) => (
                <Button
                  key={day}
                  type="button"
                  onClick={() => handleCollegeOperationalDayToggle(day)}
                  className={`h-[48px] px-3 rounded-[8px] border text-sm ${
                    collegeFormData.operationalDays.includes(day)
                      ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                      : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>
            {collegeFormErrors.operationalDays && (
              <p className="text-red-500 text-xs mt-1">
                {collegeFormErrors.operationalDays}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Other Activities */}
        <InputField
          label="Other activities"
          name="otherActivities"
          value={collegeFormData.otherActivities}
          onChange={handleCollegeFieldChange}
          placeholder="Enter activities"
          isTextarea
          rows={2}
          error={collegeFormErrors.otherActivities}
          required
        />

        {/* Row 4: Radio Button Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Hostel facility ?"
            name="hostelFacility"
            value={collegeFormData.hostelFacility}
            onChange={(e) =>
              handleCollegeRadioChangeWithValidation("hostelFacility", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={collegeFormErrors.hostelFacility}
            required
          />

          <InputField
            label="Playground ?"
            name="playground"
            value={collegeFormData.playground}
            onChange={(e) =>
              handleCollegeRadioChangeWithValidation("playground", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={collegeFormErrors.playground}
            required
          />
        </div>

        {/* Row 5: Bus Service */}
        <InputField
          label="Bus service ?"
          name="busService"
          value={collegeFormData.busService}
          onChange={(e) =>
            handleCollegeRadioChangeWithValidation("busService", e.target.value)
          }
          isRadio
          options={["Yes", "No"]}
          error={collegeFormErrors.busService}
          required
        />

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full max-w-[500px] h-[48px] bg-[#0222D7] text-white rounded-[12px] font-semibold hover:bg-blue-700 transition-colors"
          >
            {isLoading ? "Saving..." : "Save & Next"}
          </Button>
        </div>
      </form>
    </>
  );
}
