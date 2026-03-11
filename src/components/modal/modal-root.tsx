"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalRootProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  keepMounted?: boolean;
  closeOnBackdropClick?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export function ModalRoot({
  open,
  onOpenChange,
  keepMounted = false,
  closeOnBackdropClick = true,
  title,
  description,
  showCloseButton = false,
  headerClassName,
  contentClassName,
  children,
}: ModalRootProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal={!closeOnBackdropClick}
    >
      <DialogContent
        className={contentClassName}
        showCloseButton={showCloseButton}
        keepMounted={keepMounted}
      >
        {title || description ? (
          <DialogHeader className={headerClassName}>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
}
