"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { paymentAPI } from "@/lib/api";

type Props = {
  title?: string;
  description?: string;
  transactionId?: string | null;
  paymentId?: string | null;
  orderId?: string | null;
  onDownloadReceipt?: () => void;
};

export default function PaymentSuccess({
  title = "Payment Successful !",
  description = "Welcome to Too Clarity Your yearly plan is now active and you can access all premium features.",
  transactionId,
  paymentId,
  orderId,
  onDownloadReceipt,
}: Props) {
  const router = useRouter();

  const handleDownloadReceipt = () => {
    if (onDownloadReceipt) return onDownloadReceipt();
    const url = paymentAPI.getReceiptUrl({ transactionId, paymentId, orderId });
    window.open(url);
  };

  const displayTxn = transactionId || paymentId || orderId || "";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(187,247,208,0.35)_50%,_rgba(255,255,255,1)_80%)] px-4">
      <section className="mx-auto w-full max-w-3xl text-center">
        {/* Soft radial glow background + concentric success icon */}
        <div className="relative mx-auto mb-6 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-green-100/60 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-green-200 opacity-60" />
            <div className="absolute inset-3 rounded-full bg-green-300 opacity-70" />
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
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

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="h-10 w-full sm:w-auto"
            onClick={handleDownloadReceipt}
          >
            <Download className="mr-2 h-4 w-4" /> Download Receipt
          </Button>

          <Button
            variant="course"
            className="h-10 w-full sm:w-auto"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowRight className="mr-2 h-4 w-4" /> Go to Dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}
