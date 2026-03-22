"use client";

import * as React from "react";
import { Expand } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ReviewField = {
  label: string;
  required?: boolean;
  value: string;
};

type ReviewKycDocumentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onApprove: () => void;
  onReject: () => void;
  fields?: ReviewField[];
};

export function ReviewKycDocumentModal({
  open,
  onOpenChange,
  title,
  description,
  onApprove,
  onReject,
  fields = [],
}: ReviewKycDocumentModalProps) {
  const [previewExpanded, setPreviewExpanded] = React.useState(false);

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[820px] p-6 sm:p-8"
    >
      <div className="space-y-6">
        <ModalShell.Header
          title={title}
          description={description}
          className="border-b border-primary-grey-stroke pb-5 pl-0"
          descriptionClassName="text-sm text-text-grey"
        />

        <ModalShell.Body className="rounded-3xl p-4 sm:p-6">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl bg-primary-black">
              <div className="aspect-[16/7] w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
              <button
                type="button"
                onClick={() => setPreviewExpanded(true)}
                className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-black/60 text-primary-white transition-colors hover:bg-primary-black/80"
                aria-label="Expand preview"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>

            {fields.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.label} className="space-y-2">
                    <p className="text-xs font-semibold text-text-grey">
                      {field.label}
                      {field.required ? <span className="text-text-red"> *</span> : null}
                    </p>
                    <Input
                      value={field.value}
                      readOnly
                      aria-readonly="true"
                      className={cn("bg-primary-grey-stroke text-text-black")}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </ModalShell.Body>

        {previewExpanded ? (
          <div
            role="dialog"
            aria-label="Expanded preview"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
            onClick={() => setPreviewExpanded(false)}
          >
            <div
              className="w-full max-w-5xl overflow-hidden rounded-3xl bg-primary-black"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="aspect-video w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
            </div>
          </div>
        ) : null}

        <ModalShell.Footer className="pt-0" stackOnMobile={false}>
          <ModalShell.Action
            type="button"
            variant="danger"
            className="h-12 min-w-[240px] rounded-2xl"
            onClick={onReject}
          >
            Reject
          </ModalShell.Action>
          <ModalShell.Action
            type="button"
            variant="success"
            className="h-12 min-w-[240px] rounded-2xl"
            onClick={onApprove}
          >
            Approve
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
