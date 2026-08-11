"use client";

import { Check, CheckCircle2, Clock, Undo2 } from "lucide-react";

import { formatDateLabel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import type { AssetMarketListingStatus } from "@/types/marketplace.type";
import { cn } from "@/lib/utils";

type TradeStatusHistoryPanelProps = {
  submittedAt: string;
  resolvedAt?: string;
  status: AssetMarketListingStatus;
  rejectionReason?: string;
};

type TradeStep = {
  title: string;
  description: string;
};

function buildTradeSteps(submittedAt: string): TradeStep[] {
  return [
    {
      title: "Send request for verification",
      description: `The first step is to send in your request for verification. (submitted date: ${formatDateLabel(submittedAt)})`,
    },
    {
      title: "Specialist reviews details",
      description: "Our in-house specialist will review the trade request details you submitted.",
    },
    {
      title: "Physical evaluation at flagship location",
      description:
        "The seller's luxury asset is confirmed and evaluated at our flagship location, Mon–Fri, before the trade proceeds.",
    },
    {
      title: "Final Sell Offer - Seller Receives Payment",
      description:
        "Once the final offer is accepted, the buyer's locked payment is released to the seller.",
    },
    {
      title: "Asset Released to Buyer",
      description: "",
    },
  ];
}

// How far along the timeline each listing status reads as — approved/rejected listings have
// already passed review, so only the pending state shows unfinished steps.
const COMPLETED_STEPS_BY_STATUS: Record<AssetMarketListingStatus, number> = {
  pending: 3,
  approved: 5,
  rejected: 3,
};

export function TradeStatusHistoryPanel({
  submittedAt,
  resolvedAt,
  status,
  rejectionReason,
}: TradeStatusHistoryPanelProps) {
  const steps = buildTradeSteps(submittedAt);
  const completedSteps = COMPLETED_STEPS_BY_STATUS[status];
  const resolvedDateLabel = resolvedAt ? formatDateLabel(resolvedAt) : null;

  return (
    <div className="rounded-2xl bg-primary-white p-5">
      <div className="flex items-center gap-3 pb-4">
        <Undo2 className="h-5 w-5 text-text-black" />
        <h3 className="text-lg font-semibold text-text-black">Trade Status History</h3>
      </div>

      <p className="text-sm text-text-black">
        Tip: Ensure your asset collateral details are correct to reduce chances of rejection.
      </p>

      <div className="flex items-center gap-2 py-4 text-sm text-text-grey">
        <Clock className="h-4 w-4" />
        <span>Trade approvals typically take 3-7 business days</span>
      </div>

      <ol>
        {steps.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-2.75 top-6 h-[calc(100%-1.25rem)] w-px",
                    isCompleted ? "bg-alert-success" : "bg-primary-grey-stroke",
                  )}
                />
              ) : null}

              <span
                className={cn(
                  "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                  isCompleted
                    ? "bg-alert-success text-primary-white"
                    : "border border-primary-grey-stroke text-text-grey",
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>

              <div className="space-y-1.5">
                <p
                  className={cn(
                    "font-semibold",
                    isCompleted ? "text-text-black" : "text-text-grey",
                  )}
                >
                  {step.title}
                </p>
                {step.description ? (
                  <p className="text-sm text-text-grey">{step.description}</p>
                ) : null}

                {isLast && status !== "pending" && resolvedDateLabel ? (
                  <div
                    className={cn(
                      "mt-2 flex items-center gap-2 rounded-2xl p-4 text-sm",
                      status === "approved"
                        ? "bg-alertSoft-success text-text-black"
                        : "bg-alertSoft-error text-text-black",
                    )}
                  >
                    <CheckCircle2
                      className={cn(
                        "h-5 w-5 shrink-0",
                        status === "approved" ? "text-alert-success" : "text-alert-error",
                      )}
                    />
                    <span>
                      {status === "approved"
                        ? `Trade has been approved as at ${resolvedDateLabel}`
                        : `Trade was cancelled as at ${resolvedDateLabel}${rejectionReason ? ` — ${rejectionReason}` : ""}`}
                    </span>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
