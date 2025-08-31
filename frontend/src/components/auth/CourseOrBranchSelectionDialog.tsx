import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface CourseOrBranchSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelection: (selection: "course" | "branch") => void;
}

export default function CourseOrBranchSelectionDialog({
  open,
  onOpenChange,
  onSelection,
}: CourseOrBranchSelectionDialogProps) {
  const handleContinue = () => {
    // default to course (or you can change logic to ask user later)
    onSelection("course");
    onOpenChange(false);
  };

  return (
    <Dialog
  open={open}
  onOpenChange={() => {}} // prevent backdrop close
>
  <DialogContent
    className="max-w-[500px] rounded-[16px] bg-white border-0 shadow-lg p-8 text-center"
    onEscapeKeyDown={(e) => e.preventDefault()}
    onInteractOutside={(e) => e.preventDefault()}
    showCloseButton={false}
    overlayClassName="bg-black/80"   // ✅ this adds black overlay with 50% opacity
  >
    {/* Title */}
    <h2 className="text-xl font-bold text-gray-900 mb-4">
      Which One Should You Pick !
    </h2>

    {/* Description */}
    <div className="text-gray-700 text-sm space-y-3 mb-6">
      <p>
        <span className="font-semibold">Course</span> – For institutes
        without branches. Add all courses directly under the main institute.
      </p>
      <p>
        <span className="font-semibold">Branch</span> – For institutes with
        multiple branches. Add a branch first, then list the courses for that
        branch.
      </p>
    </div>

    {/* Continue Button */}
    <Button
      onClick={handleContinue}
      className="w-[160px] h-[40px] mx-auto rounded-[8px] font-semibold text-base bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
    >
      Continue
    </Button>
  </DialogContent>
</Dialog>

  );
}
