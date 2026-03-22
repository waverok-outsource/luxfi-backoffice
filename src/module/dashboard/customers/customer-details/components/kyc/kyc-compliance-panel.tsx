"use client";

import * as React from "react";
import { BriefcaseBusiness, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskGradientBar } from "@/components/ui/risk-gradient-bar";
import { cn } from "@/lib/utils";
import { ReviewKycDocumentModal } from "@/module/dashboard/customers/customer-details/components/kyc/review-kyc-document-modal";

export type KycDocumentStatus = "NOT_VERIFIED" | "PENDING" | "APPROVED" | "REJECTED";

export type KycDocument = {
  id: string;
  title: string;
  uploadedAtLabel: string;
  status: KycDocumentStatus;
};

const DEFAULT_KYC_DOCUMENTS: KycDocument[] = [
  {
    id: "face-id",
    title: "Face ID",
    uploadedAtLabel: "Uploaded · 10/01/2025 - 2:35pm",
    status: "NOT_VERIFIED",
  },
  {
    id: "personal-id",
    title: "Personal ID Document",
    uploadedAtLabel: "Uploaded · 10/01/2025 - 2:35pm",
    status: "NOT_VERIFIED",
  },
  {
    id: "address-id",
    title: "Address ID Document",
    uploadedAtLabel: "Uploaded · 10/01/2025 - 2:35pm",
    status: "NOT_VERIFIED",
  },
];

function getDocumentBadge(status: KycDocumentStatus) {
  switch (status) {
    case "APPROVED":
      return { variant: "success" as const, label: "Approved", showStatusDot: true };
    case "REJECTED":
      return { variant: "error" as const, label: "Rejected", showStatusDot: true };
    case "PENDING":
      return { variant: "warning" as const, label: "Pending", showStatusDot: true };
    default:
      return { variant: "disabled" as const, label: "Not Verified", showStatusDot: true };
  }
}

function getTier2Status(documents: KycDocument[]) {
  if (documents.length === 0) return "NOT_VERIFIED" as const;
  if (documents.every((doc) => doc.status === "APPROVED")) return "APPROVED" as const;
  if (documents.some((doc) => doc.status !== "NOT_VERIFIED")) return "PENDING" as const;
  return "NOT_VERIFIED" as const;
}

const DOC_REVIEW_CONFIG: Record<
  KycDocument["id"],
  {
    title: string;
    description: string;
    fields?: { label: string; required?: boolean; value: string }[];
  }
> = {
  "face-id": {
    title: "Review Face ID",
    description: "Verify that the customer's Face ID matches submitted identity documents.",
  },
  "personal-id": {
    title: "Review Personal ID",
    description:
      "Verify that the customer's Face ID and registered names matches submitted identity documents.",
    fields: [
      { label: "Document Type", required: true, value: "National ID/ NIN" },
      { label: "ID Number", required: true, value: "2214777448898378346745643" },
    ],
  },
  "address-id": {
    title: "Review Address ID",
    description:
      "Verify that the customer's Face ID and registered names matches submitted identity documents.",
    fields: [
      { label: "Country", required: true, value: "Nigeria" },
      { label: "State of Origin", required: true, value: "Lagos" },
      { label: "LGA", required: true, value: "Ikeja" },
      { label: "House Address", required: true, value: "10B, Giwa Avenue, Ikeja GRA," },
    ],
  },
};

export function KycCompliancePanel() {
  const [documents, setDocuments] = React.useState<KycDocument[]>(DEFAULT_KYC_DOCUMENTS);
  const [activeDocumentId, setActiveDocumentId] = React.useState<KycDocument["id"] | null>(null);
  const riskScore = 80;

  const activeDocument = React.useMemo(
    () => documents.find((doc) => doc.id === activeDocumentId) ?? null,
    [activeDocumentId, documents],
  );

  const tier2Status = React.useMemo(() => getTier2Status(documents), [documents]);

  const setDocumentStatus = React.useCallback(
    (documentId: KycDocument["id"], status: KycDocumentStatus) => {
      setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status } : doc)));
    },
    [],
  );

  const openReview = (documentId: KycDocument["id"]) => {
    const doc = documents.find((item) => item.id === documentId);
    if (doc && doc.status === "NOT_VERIFIED") {
      setDocumentStatus(documentId, "PENDING");
    }
    setActiveDocumentId(documentId);
  };

  const closeReview = () => setActiveDocumentId(null);

  const handleReject = () => {
    if (!activeDocument) return;
    setDocumentStatus(activeDocument.id, "REJECTED");
    closeReview();
  };

  const handleApprove = () => {
    if (!activeDocument) return;
    setDocumentStatus(activeDocument.id, "APPROVED");
    closeReview();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          disabled
          className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey disabled:opacity-50"
        >
          Downgrade Tier Level
        </Button>
      </div>

      <div className="rounded-2xl bg-primary-grey-undertone p-5">
        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex h-4 w-8 items-center justify-center rounded-full bg-alertSoft-success">
              <span className="inline-flex size-2.5 items-center justify-center rounded-full bg-alert-success text-primary-white">
                <Check className="size-2" strokeWidth={2.5} />
              </span>
            </span>
            <p className="text-base font-semibold text-text-black">Tier 1</p>
          </div>

          <div className="relative h-px w-full">
            <div className="h-px w-full border-t border-dashed border-text-grey" />
            <span className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-alert-disabled" />
            <span className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-alert-disabled" />
          </div>

          <div className="space-y-2 text-center">
            <Badge
              variant={
                tier2Status === "APPROVED"
                  ? "success"
                  : tier2Status === "PENDING"
                    ? "warning"
                    : "disabled"
              }
              showStatusDot
              className="mx-auto"
            >
              {tier2Status === "APPROVED"
                ? "Verified"
                : tier2Status === "PENDING"
                  ? "In progress"
                  : "Not Verified"}
            </Badge>
            <p className="text-base font-semibold text-text-black">Tier 2</p>
          </div>

          <div className="relative h-px w-full">
            <div className="h-px w-full border-t border-dashed border-text-grey" />
            <span className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-alert-disabled" />
            <span className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-alert-disabled" />
          </div>

          <div className="space-y-2 text-right">
            <Badge variant="disabled" showStatusDot className="ml-auto">
              Not Verified
            </Badge>
            <p className="text-base font-semibold text-text-grey">Tier 3</p>
          </div>
        </div>
      </div>

      <hr className="border-primary-grey-stroke" />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-black">KYC Requirement Documents</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {documents.map((doc) => {
            const badge = getDocumentBadge(doc.status);

            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => openReview(doc.id)}
                className={cn(
                  "w-full text-left rounded-2xl border border-primary-grey-stroke bg-primary-white p-4 transition-colors",
                  "hover:bg-primary-grey-undertone",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary-grey-stroke bg-primary-white text-text-grey">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-text-black">{doc.title}</p>
                      <Badge variant={badge.variant} showStatusDot={badge.showStatusDot}>
                        {badge.label}
                      </Badge>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-text-grey">
                      <span>Uploaded</span>
                      <span className="text-text-grey/40">·</span>
                      <span>{doc.uploadedAtLabel.replace(/^Uploaded\s*·\s*/i, "")}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <RiskGradientBar
        position={riskScore}
        variant="success"
        markerContent={`${riskScore}%`}
        labels={["Safe", "Medium", "High", "Critical"]}
        size="sm"
        title="Risk Assessment Level"
      />

      {activeDocument ? (
        <ReviewKycDocumentModal
          open={Boolean(activeDocument)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) closeReview();
          }}
          title={DOC_REVIEW_CONFIG[activeDocument.id].title}
          description={DOC_REVIEW_CONFIG[activeDocument.id].description}
          fields={DOC_REVIEW_CONFIG[activeDocument.id].fields}
          onReject={handleReject}
          onApprove={handleApprove}
        />
      ) : null}
    </div>
  );
}
