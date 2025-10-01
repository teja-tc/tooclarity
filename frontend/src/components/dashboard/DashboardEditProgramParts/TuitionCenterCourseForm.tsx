"use client";

import React from "react";
import InputField from "@/components/ui/InputField";
import { Clock, Building, IndianRupee, User, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. A specific interface for all Tuition Center form data
export interface TuitionCenterCourseFormData {
    _id?: string;
    tuitionType?: "Home Tuition" | "Center Tuition" | "";
    instructorProfile?: string;
    subject?: string;
    totalSeats?: number | string;
    availableSeats?: number | string;
    pricePerSeat?: number | string;
    openingTime?: string;
    closingTime?: string;
    operationalDays?: string[];
}

// 2. A single, simplified props interface for the form component
interface TuitionCenterCourseFormProps {
    formData: Partial<TuitionCenterCourseFormData>;
    formErrors?: Record<string, string>;
    handleFieldChange: (name: string, value: any) => void;
    handleOperationalDayToggle: (day: string) => void;
    operationalDaysOptions: string[];
    handleSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
    onPrevious?: () => void;
}

export default function TuitionCenterCourseForm({
    formData,
    formErrors = {},
    handleFieldChange,
    handleOperationalDayToggle,
    operationalDaysOptions = [],
    handleSubmit,
    isLoading = false,
    onPrevious,
}: TuitionCenterCourseFormProps) {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold">Editing Tuition Center Program</h3>
            
            {/* ====== Core Details ====== */}
            <div className="grid md:grid-cols-2 gap-6">
                <InputField
                    label="Tuition Type"
                    name="tuitionType"
                    value={formData.tuitionType || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isSelect
                    options={["Home Tuition", "Center Tuition"]}
                    placeholder="Select tuition type"
                    error={formErrors.tuitionType}
                    required
                />
                <InputField
                    label="Instructor Profile"
                    name="instructorProfile"
                    value={formData.instructorProfile || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    placeholder="Enter instructor's name"
                    icon={<User size={18} />}
                    error={formErrors.instructorProfile}
                    required
                />
                <InputField
                    label="Subject"
                    name="subject"
                    value={formData.subject || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    placeholder="e.g., Mathematics, Physics"
                    icon={<Book size={18} />}
                    error={formErrors.subject}
                    required
                />
                <InputField
                    label="Price Per Seat/Hour"
                    name="pricePerSeat"
                    type="number"
                    value={formData.pricePerSeat || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    icon={<IndianRupee size={18} />}
                    error={formErrors.pricePerSeat}
                    required
                />
            </div>

            {/* ====== Seating & Timings ====== */}
            <div className="grid md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                    <label className="font-medium text-[16px]">Seats *</label>
                    <div className="grid grid-cols-2 gap-2">
                        <InputField
                            label=""
                            name="totalSeats"
                            type="number"
                            value={formData.totalSeats || ""}
                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                            placeholder="Total"
                            icon={<Building size={18} />}
                            error={formErrors.totalSeats}
                        />
                        <InputField
                            label=""
                            name="availableSeats"
                            type="number"
                            value={formData.availableSeats || ""}
                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                            placeholder="Available"
                            icon={<Building size={18} />}
                            error={formErrors.availableSeats}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-[16px]">Operational Times *</label>
                    <div className="grid grid-cols-2 gap-2">
                        <InputField
                            label=""
                            name="openingTime"
                            type="time"
                            value={formData.openingTime || ""}
                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                            icon={<Clock size={18} />}
                            error={formErrors.openingTime}
                        />
                        <InputField
                            label=""
                            name="closingTime"
                            type="time"
                            value={formData.closingTime || ""}
                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                            icon={<Clock size={18} />}
                            error={formErrors.closingTime}
                        />
                    </div>
                </div>
            </div>
            
            {/* ====== Operational Days ====== */}
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

            {/* ====== Buttons ====== */}
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