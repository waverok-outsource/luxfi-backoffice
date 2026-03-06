"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ModalRootProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
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
  trigger,
  title,
  description,
  showCloseButton = false,
  headerClassName,
  contentClassName,
  children,
}: ModalRootProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}

      <DialogContent className={contentClassName} showCloseButton={showCloseButton}>
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
