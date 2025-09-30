"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";

// Define a unified interface for the component's props
interface UgPgFormProps {
  formData: any;
  formErrors: Record<string, string>;
  handleFieldChange: (name: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onPrevious: () => void;
}

export default function UnderPostGraduateCourseForm({
  formData,
  formErrors,
  handleFieldChange,
  handleSubmit,
  isLoading,
  onPrevious,
}: UgPgFormProps) {
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
          label="Graduation type"
          name="graduationType"
          value={formData.graduationType || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Under Graduation", "Post Graduation"]}
          placeholder="Select graduation type"
          error={formErrors.graduationType}
          required
        />
        <InputField
          label="Stream type"
          name="streamType"
          value={formData.streamType || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Engineering and Technology (B.E./B.Tech.)", "Medical Sciences", "Arts and Humanities (B.A.)", "Science (B.Sc.)", "Commerce (B.Com.)", "Business Administration (BBA)", "Computer Applications (BCA)", "Fine Arts (BFA)", "Law (LL.B./Integrated Law Courses)"]}
          placeholder="Select Stream type"
          error={formErrors.streamType}
          required
        />
        <InputField
          label="Select branch"
          name="selectBranch"
          value={formData.selectBranch || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isSelect
          options={["Computer Science and Engineering", "Electronics and Communication Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Aerospace Engineering", "Biotechnology Engineering", "Information Technology", "Marine Engineering", "Mining Engineering", "Metallurgical Engineering", "Agricultural Engineering"]}
          placeholder="Select branch type"
          error={formErrors.selectBranch}
          required
        />
        <InputField
          label="About branch"
          name="aboutBranch"
          value={formData.aboutBranch || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          isTextarea
          rows={4}
          placeholder="Enter the course info"
          error={formErrors.aboutBranch}
          required
        />
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">Education type</label>
          <SlidingIndicator
            options={["Full time", "part time", "Distance"] as const}
            activeOption={formData.educationType}
            onOptionChange={(option) => handleFieldChange("educationType", option)}
            size="md"
          />
          {formErrors.educationType && <p className="text-red-500 text-xs mt-1">{formErrors.educationType}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">Mode</label>
          <SlidingIndicator
            options={["Offline", "Online", "Hybrid"] as const}
            activeOption={formData.mode}
            onOptionChange={(option) => handleFieldChange("mode", option)}
            size="md"
          />
          {formErrors.mode && <p className="text-red-500 text-xs mt-1">{formErrors.mode}</p>}
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
          label="Class size"
          name="classSize"
          value={formData.classSize || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="Enter no of students per class"
          type="number"
          error={formErrors.classSize}
          required
        />
        <InputField
          label="Eligibility Criteria"
          name="eligibilityCriteria"
          value={formData.eligibilityCriteria || ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder="e.g., Must have completed 10th Grade"
          error={formErrors.eligibilityCriteria}
          required
        />
      </div>

      {/* --- Section 2: Institution Details --- */}
      <div className="space-y-4 border-t pt-8">
        <h3 className="text-xl md:text-2xl font-bold">Institution Details</h3>
        <p className="text-[#697282] text-sm">
          Share the key facts about your college or university.
        </p>
        <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Ownership type"
                    name="ownershipType"
                    value={formData.ownershipType || ''}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isSelect
                    options={["Government", "Private", "Semi-Government", "Aided", "Unaided"]}
                    placeholder="Select ownership type"
                    error={formErrors.ownershipType}
                    required
                />
                <InputField
                    label="College category"
                    name="collegeCategory"
                    value={formData.collegeCategory || ''}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isSelect
                    options={["Engineering", "Medical", "Arts & Science", "Commerce", "Management", "Law", "Other"]}
                    placeholder="Select Category"
                    error={formErrors.collegeCategory}
                    required
                />
            </div>
            <InputField
                label="Affiliation type"
                name="affiliationType"
                value={formData.affiliationType || ''}
                onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                isSelect
                options={["University", "Autonomous", "Affiliated", "Deemed University", "Other"]}
                placeholder="Select Affiliation type"
                error={formErrors.affiliationType}
                required
            />
            
            {/* Placements Section */}
            <h4 className="text-lg font-semibold text-black pt-4">Placements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Placement drives ?" name="placementDrives" value={formData.placementDrives} onChange={(e) => handleFieldChange("placementDrives", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.placementDrives} required />
                <InputField label="Mock interviews ?" name="mockInterviews" value={formData.mockInterviews} onChange={(e) => handleFieldChange("mockInterviews", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.mockInterviews} required />
                <InputField label="Resume building ?" name="resumeBuilding" value={formData.resumeBuilding} onChange={(e) => handleFieldChange("resumeBuilding", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.resumeBuilding} required />
                <InputField label="Linked-in optimization ?" name="linkedinOptimization" value={formData.linkedinOptimization} onChange={(e) => handleFieldChange("linkedinOptimization", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.linkedinOptimization} required />
            </div>
            <InputField label="Access to exclusive job portal ?" name="exclusiveJobPortal" value={formData.exclusiveJobPortal} onChange={(e) => handleFieldChange("exclusiveJobPortal", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.exclusiveJobPortal} required />
            
            {/* Other Questions Section */}
            <h4 className="text-lg font-semibold text-black pt-4">Facilities & Other</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Library ?" name="library" value={formData.library} onChange={(e) => handleFieldChange("library", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.library} required />
                <InputField label="Hostel facility ?" name="hostelFacility" value={formData.hostelFacility} onChange={(e) => handleFieldChange("hostelFacility", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.hostelFacility} required />
                <InputField label="Entrance exam ?" name="entranceExam" value={formData.entranceExam} onChange={(e) => handleFieldChange("entranceExam", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.entranceExam} required />
                <InputField label="Management Quota ?" name="managementQuota" value={formData.managementQuota} onChange={(e) => handleFieldChange("managementQuota", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.managementQuota} required />
                <InputField label="Playground ?" name="playground" value={formData.playground} onChange={(e) => handleFieldChange("playground", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.playground} required />
                <InputField label="Bus service ?" name="busService" value={formData.busService} onChange={(e) => handleFieldChange("busService", e.target.value)} isRadio options={["Yes", "No"]} error={formErrors.busService} required />
            </div>
        </div>
      </div>

      {/* --- Form Actions --- */}
      <div className="flex flex-col sm:flex-row justify-center pt-6 gap-4 sm:gap-10">
              <Button type="submit" disabled={isLoading} className="w-full md:w-[314px] h-[48px] bg-[#697282] text-white rounded-[12px] font-semibold text-[18px]">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
    </form>
  );
}