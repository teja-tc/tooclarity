"use client";

import React from "react";
import InputField from "@/components/ui/InputField";
import { Clock, Building, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. A specific interface for all Study Hall form data
export interface StudyHallCourseFormData {
    _id?: string;
    seatingOption?: "Individual Desk" | "Shared Table" | "Private Cabin" | "Open Seating" | "";
    openingTime?: string;
    hallName?: string; 
    closingTime?: string;
    operationalDays?: string[];
    totalSeats?: number | string;
    availableSeats?: number | string;
    pricePerSeat?: number | string;
    hasWifi?: "Yes" | "No";
    hasChargingPoints?: "Yes" | "No";
    hasAC?: "Yes" | "No";
    hasPersonalLocker?: "Yes" | "No";
}

// 2. A single, simplified props interface
interface StudyHallCourseFormProps {
    formData: Partial<StudyHallCourseFormData>;
    formErrors?: Record<string, string>;
    handleFieldChange: (name: string, value: any) => void;
    handleOperationalDayToggle: (day: string) => void;
    operationalDaysOptions: string[];
    handleSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
    onPrevious?: () => void;
}

export default function StudyHallCourseForm({
    formData,
    formErrors = {},
    handleFieldChange,
    handleOperationalDayToggle,
    operationalDaysOptions = [],
    handleSubmit,
    isLoading = false,
    onPrevious,
}: StudyHallCourseFormProps) {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold">Editing Study Hall Program</h3>
            

            {/* ====== Core Details ====== */}
            <div className="grid md:grid-cols-2 gap-6">
                 <InputField
                    label="Hall Name"
                    name="hallName"
                    value={formData.hallName || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    placeholder="Enter the hall name"
                    error={formErrors.hallName}
                    required
                />
                <InputField
                    label="Seating Option"
                    name="seatingOption"
                    value={formData.seatingOption || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isSelect
                    options={["Individual Desk", "Shared Table", "Private Cabin", "Open Seating"]}
                    placeholder="Select seating option"
                    error={formErrors.seatingOption}
                    required
                />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Operational Times */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-[16px]">Operational Times <span className="text-red-500 font-bold">*</span></label>
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

                {/* Operational Days */}
                {/* Operational Days */}
<div className="flex flex-col gap-2">
    <label className="font-medium text-[16px]">Operational Days <span className="text-red-500 font-bold">*</span></label>
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
            </div>

            {/* ====== Seating & Pricing ====== */}
            <div className="grid md:grid-cols-2 gap-6">
                <InputField
                    label="Total Seats"
                    name="totalSeats"
                    type="number"
                    value={formData.totalSeats || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    icon={<Building size={18} />}
                    error={formErrors.totalSeats}
                    required
                />
                <InputField
                    label="Available Seats"
                    name="availableSeats"
                    type="number"
                    value={formData.availableSeats || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    icon={<Building size={18} />}
                    error={formErrors.availableSeats}
                    required
                />
                <InputField
                    label="Price Per Seat"
                    name="pricePerSeat"
                    type="number"
                    value={formData.pricePerSeat || ""}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    icon={<IndianRupee size={18} />}
                    error={formErrors.pricePerSeat}
                    required
                />
            </div>

            {/* ====== Facilities ====== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputField
                    label="Wi-Fi?"
                    name="hasWifi"
                    value={formData.hasWifi || "No"}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isRadio
                    options={["Yes", "No"]}
                    error={formErrors.hasWifi}
                    required
                />
                <InputField
                    label="Charging Points?"
                    name="hasChargingPoints"
                    value={formData.hasChargingPoints || "No"}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isRadio
                    options={["Yes", "No"]}
                    error={formErrors.hasChargingPoints}
                    required
                />
                <InputField
                    label="Air Conditioner (AC)?"
                    name="hasAC"
                    value={formData.hasAC || "No"}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isRadio
                    options={["Yes", "No"]}
                    error={formErrors.hasAC}
                    required
                />
                <InputField
                    label="Personal Lockers?"
                    name="hasPersonalLocker"
                    value={formData.hasPersonalLocker || "No"}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                    isRadio
                    options={["Yes", "No"]}
                    error={formErrors.hasPersonalLocker}
                    required
                />
            </div>

            {/* ====== Buttons ====== */}
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