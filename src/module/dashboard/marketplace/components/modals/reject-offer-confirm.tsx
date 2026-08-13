"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell } from "@/components/modal";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { REJECTION_REASON_OPTIONS } from "@/module/dashboard/marketplace/data";
import { rejectOfferSchema, type RejectOfferFormValues } from "@/schema/marketplace.schema";

const DEFAULT_VALUES: RejectOfferFormValues = { rejectionReason: "" };

type RejectOfferConfirmProps = {
  offerTypeLabel: string;
  assetName: string;
  assetId: string;
  partyName: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: (values: RejectOfferFormValues) => void;
};

export function RejectOfferConfirm({
  offerTypeLabel,
  assetName,
  assetId,
  partyName,
  pending = false,
  onCancel,
  onConfirm,
}: RejectOfferConfirmProps) {
  const formId = React.useId();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<RejectOfferFormValues>({
    resolver: zodResolver(rejectOfferSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Reject Offer?"
        description={
          <>
            You are about to reject this {offerTypeLabel} for{" "}
            <span className="font-semibold text-text-black">
              {assetName} {assetId}
            </span>{" "}
            from <span className="font-semibold text-text-black">{partyName}</span>.
          </>
        }
      />

      <ModalShell.Body>
        <form id={formId} onSubmit={handleSubmit(onConfirm)}>
          <FormField control={control} name="rejectionReason" label="Reason for Rejection" required>
            {({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormSelectTrigger>
                  <SelectValue placeholder="Select Options" />
                </FormSelectTrigger>
                <SelectContent>
                  {REJECTION_REASON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </form>
      </ModalShell.Body>

      <ModalShell.Footer className="pt-2">
        <ModalShell.Action type="button" variant="grey-stroke" disabled={pending} onClick={onCancel}>
          No, Cancel
        </ModalShell.Action>
        <ModalShell.Action
          type="submit"
          form={formId}
          variant="danger"
          disabled={!isValid || pending}
          pending={pending}
        >
          Yes, Confirm
        </ModalShell.Action>
      </ModalShell.Footer>
    </div>
  );
}
