You said:
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VerifyDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  phone: string;
}

export default function VerifyDialog({ open, setOpen, phone }: VerifyDialogProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  // countdown
  useEffect(() => {
    if (!open) return;
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [open, timer]);

  const handleOtpChange = (val: string, idx: number) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[400px] p-6 rounded-[24px] bg-white text-center">
        <DialogHeader>
          <DialogTitle>Verify Mobile Number</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to your mobile number {phone}
          </DialogDescription>
        </DialogHeader>

        {/* OTP INPUTS */}
        <div className="flex justify-center gap-2 my-4">
          {otp.map((d, i) => (
            <Input
              key={i}
              maxLength={1}
              className="w-10 h-12 text-center text-lg"
              value={d}
              onChange={(e) => handleOtpChange(e.target.value, i)}
            />
          ))}
        </div>

        {/* TIMER + RESEND */}
        <p className="text-sm text-gray-500">Code expires in {timer}s</p>
        <button
          className="text-blue-600 text-sm mt-2"
          onClick={() => setTimer(60)}
        >
          Resend Code
        </button>

        <Button className="w-full mt-4 bg-blue-600 text-white">
          Verify Mobile Number
        </Button>
      </DialogContent>
    </Dialog>
  );
}