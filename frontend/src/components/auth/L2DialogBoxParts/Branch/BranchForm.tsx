"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

interface Branch {
  id: number;
  branchName: string;
  branchAddress: string;
  contactInfo: string;
  locationUrl: string;
}

interface BranchFormProps {
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  selectedBranchId: number;
  setSelectedBranchId: React.Dispatch<React.SetStateAction<number>>;
  handleBranchChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBranchSubmit: (e: FormEvent<HTMLFormElement>) => void;
  deleteBranch: (branchId: number) => void;
  addNewBranch: () => void;
  isLoading: boolean;
}

export default function BranchForm({
  branches,
  selectedBranchId,
  handleBranchChange,
  handleBranchSubmit,
  deleteBranch,
  addNewBranch,
  isLoading,
}: BranchFormProps) {
  const currentBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <form onSubmit={handleBranchSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Branch Name"
          name="branchName"
          value={currentBranch.branchName}
          onChange={handleBranchChange}
          placeholder="Enter Course name"
          required
        />
        <InputField
          label="Contact info"
          name="contactInfo"
          value={currentBranch.contactInfo}
          onChange={handleBranchChange}
          placeholder="+91 00000 0000"
          type="tel"
          numericOnly
          pattern="[0-9]*"
          maxLength={10}
          required
        />
        <InputField
          label="Branch address"
          name="branchAddress"
          value={currentBranch.branchAddress}
          onChange={handleBranchChange}
          placeholder="Enter address"
          required
        />
        <InputField
          label="Location URL"
          name="locationUrl"
          value={currentBranch.locationUrl}
          onChange={handleBranchChange}
          placeholder="Paste the URL"
          required
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full max-w-[400px] h-[48px] rounded-[12px] font-semibold transition-colors
            ${
              isLoading
                ? "opacity-50 cursor-not-allowed bg-gray-600"
                : "bg-[#6B7280] hover:bg-[#6B7280]/90"
            } text-white`}
        >
          {isLoading ? "Saving..." : "Add Branch"}
        </Button>
      </div>
    </form>
  );
}
