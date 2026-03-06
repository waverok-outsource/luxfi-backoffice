"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModalRoot } from "@/components/modal/modal-root";

type SuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  closeLabel?: string;
};

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = "Close",
}: SuccessModalProps) {
  return (
    <ModalRoot
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      contentClassName="max-w-[620px] border-overlay-gold bg-primary-grey-undertone px-6 py-10 sm:px-10 sm:py-14"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-alertSoft-success">
          <span className="flex size-16 items-center justify-center rounded-full bg-alert-success text-primary-white">
            <Check className="size-9" />
          </span>
        </div>

        <h3 className="text-text-black text-4xl font-semibold">{title}</h3>
        <p className="text-text-black mt-3 text-2xl">{description}</p>

        <Button
          type="button"
          className="mt-12 h-14 w-full max-w-[260px] rounded-3xl text-[2rem]"
          onClick={() => onOpenChange(false)}
        >
          {closeLabel}
        </Button>
      </div>
    </ModalRoot>
  );
}
