"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModalRoot } from "@/components/modal/modal-root";
import { cn } from "@/lib/utils";

export const SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME =
  "max-w-[470px] min-h-[360px] border-overlay-gold bg-primary-grey-undertone py-10";

type SuccessModalContentProps = {
  title: string;
  description: string;
  closeLabel?: string;
  onClose?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function SuccessModalContent({
  title,
  description,
  closeLabel = "Close",
  onClose,
  secondaryLabel,
  onSecondary,
}: SuccessModalContentProps) {
  const hasSecondary = Boolean(secondaryLabel && onSecondary);

  return (
    <div className="flex flex-col items-center text-center justify-between">
      <div className="flex flex-col items-center">
        <div className="mb-10 flex size-16 items-center justify-center rounded-full bg-alert-success text-primary-white">
          <Check className="size-9" />
        </div>

        <h3 className="text-[32px] font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>

      {hasSecondary ? (
        <div className="flex w-full items-center gap-3 mt-10">
          <Button type="button" variant="default" className="w-1/2" onClick={onClose}>
            {closeLabel}
          </Button>
          <Button type="button" variant="gold" className="w-1/2" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        </div>
      ) : (
        <Button type="button" className="min-w-[187px]" onClick={onClose}>
          {closeLabel}
        </Button>
      )}
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
