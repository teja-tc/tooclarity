"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  transactionId?: string | null;
  paymentId?: string | null;
  orderId?: string | null;
  onContact?: () => void;
};

export default function PaymentProcessing({
  title = "Your Payment is Processing",
  description = "Your transaction is currently being processed by the bank. Please do not close this window or press the back button. If this screen doesn't update within a few minutes, please contact our team for assistance.",
  transactionId,
  paymentId,
  orderId,
  onContact,
}: Props) {
  const displayTxn = transactionId || paymentId || orderId || "";

  const handleContact = () => {
    if (onContact) return onContact();
    window.open("mailto:support@tooclarity.com");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(253,230,138,0.35)_0%,_rgba(255,255,255,1)_80%)] px-4">
      <section className="mx-auto w-full max-w-3xl text-center">
        {/* Soft radial glow background + concentric processing icon */}
        <div className="relative mx-auto mb-6 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-orange-100/60 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-orange-200 opacity-60" />
            <div className="absolute inset-3 rounded-full bg-orange-300 opacity-70" />
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-orange-500">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

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

        <div className="mt-6 flex justify-center gap-2">
          <Button variant="course" className="h-10" onClick={handleContact}>
            <Mail className="mr-2 h-4 w-4" /> Contact us
          </Button>
        </div>
      </section>
    </div>
  );
}
