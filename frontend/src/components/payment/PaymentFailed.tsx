"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, RotateCcw } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  transactionId?: string | null;
  paymentId?: string | null;
  orderId?: string | null;
  onRetry?: () => void;
  onContact?: () => void;
};

export default function PaymentFailed({
  title = "Payment Failed",
  description = "Unfortunately, we were unable to process your payment. This may be due to incorrect details or an issue with your bank. Please try again.",
  transactionId,
  paymentId,
  orderId,
  onRetry,
  onContact,
}: Props) {
  const displayTxn = transactionId || paymentId || orderId || "";

  const handleContact = () => {
    if (onContact) return onContact();
    window.open("mailto:support@tooclarity.com");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.25)_0%,_rgba(255,255,255,1)_80%)] px-4">
      <section className="mx-auto w-full max-w-3xl text-center">
        {/* Soft radial glow background + concentric failed icon */}
        <div className="relative mx-auto mb-6 h-40 w-40">
          {/* Outer soft glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-100 via-red-200 to-red-300 blur-3xl" />

          {/* Concentric circles */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-red-200/70" />
            <div className="absolute inset-3 rounded-full bg-red-300/80" />
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-red-500">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title + description */}
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          {displayTxn ? (
            <div className="mt-3 text-sm">
              <span className="text-muted-foreground">Transaction ID: </span>
              <span className="text-[#0B57D0] underline underline-offset-2">
                {displayTxn}
              </span>
            </div>
          ) : null}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="h-10 w-full sm:w-auto"
            onClick={handleContact}
          >
            <Mail className="mr-2 h-4 w-4" /> Contact US
          </Button>
          <Button
            variant="course"
            className="h-10 w-full sm:w-auto"
            onClick={onRetry}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </section>
    </div>
  );
}
