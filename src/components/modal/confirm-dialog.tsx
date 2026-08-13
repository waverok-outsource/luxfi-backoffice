"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type ConfirmDialogContentProps = {
  title: string;
  description: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: "success" | "danger";
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialogContent({
  title,
  description,
  cancelLabel = "No, Cancel",
  confirmLabel = "Yes, Confirm",
  confirmVariant = "success",
  pending = false,
  onCancel,
  onConfirm,
}: ConfirmDialogContentProps) {
  return (
    <div className="space-y-6 text-center sm:space-y-8">
      <div className="space-y-3">
        <h2 className="text-[32px] font-bold leading-tight text-text-black">{title}</h2>
        <p className="mx-auto max-w-[420px] text-sm leading-6 text-text-grey">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="grey-stroke"
          className="w-full sm:flex-1"
          disabled={pending}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmVariant}
          className="w-full sm:flex-1"
          pending={pending}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
