"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModalRoot } from "@/components/modal/modal-root";
import { cn } from "@/lib/utils";

export const SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME =
  "max-w-[470px] min-h-[360px] border-overlay-gold bg-primary-grey-undertone px-6 py-8 sm:px-10 sm:py-10";

type SuccessModalContentProps = {
  title: string;
  description: string;
  closeLabel?: string;
  onClose?: () => void;
};

export function SuccessModalContent({
  title,
  description,
  closeLabel = "Close",
  onClose,
}: SuccessModalContentProps) {
  return (
    <div className="flex flex-col items-center text-center justify-between">
      <div className="flex flex-col items-center">
        <div className="flex mb-10 size-16 items-center justify-center rounded-full bg-alert-success text-primary-white">
          <Check className="size-9" />
        </div>

        <h3 className="text-[32px] font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>

      <Button type="button" className="w-[187px]" onClick={onClose}>
        {closeLabel}
      </Button>
    </div>
  );
}

type SuccessModalProps = SuccessModalContentProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentClassName?: string;
};

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = "Close",
  onClose,
  contentClassName,
}: SuccessModalProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onOpenChange(false);
  };

  return (
    <ModalRoot
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      contentClassName={cn(SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, contentClassName)}
    >
      <SuccessModalContent
        title={title}
        description={description}
        closeLabel={closeLabel}
        onClose={handleClose}
      />
    </ModalRoot>
  );
}
