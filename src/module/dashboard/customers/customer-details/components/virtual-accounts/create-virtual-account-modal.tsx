"use client";

import { ConfirmDialogContent, ModalRoot } from "@/components/modal";
import useCustomerFns from "@/services/functions/customer.fns";

type CreateVirtualAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
};

export function CreateVirtualAccountModal({
  open,
  onOpenChange,
  customerId,
  customerName,
}: CreateVirtualAccountModalProps) {
  const { createVirtualAccount, loading } = useCustomerFns();

  const handleConfirm = async () => {
    // Empty body: the platform picks a healthy provider.
    const account = await createVirtualAccount(customerId);
    if (account) onOpenChange(false);
  };

  return (
    <ModalRoot
      open={open}
      onOpenChange={(next) => {
        if (!loading.CREATE_VIRTUAL_ACCOUNT) onOpenChange(next);
      }}
      showCloseButton={false}
      contentClassName="w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
    >
      <ConfirmDialogContent
        title="Create Virtual Account?"
        description={
          <>
            This opens an NGN virtual account for{" "}
            <span className="font-semibold text-text-black">{customerName}</span> at a payment
            provider, using their verified profile details.
          </>
        }
        confirmLabel="Yes, Create"
        pending={loading.CREATE_VIRTUAL_ACCOUNT}
        onCancel={() => onOpenChange(false)}
        onConfirm={() => void handleConfirm()}
      />
    </ModalRoot>
  );
}
