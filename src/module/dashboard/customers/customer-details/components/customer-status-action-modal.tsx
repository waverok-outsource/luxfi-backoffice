"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import {
  blacklistCustomerSchema,
  type BlacklistCustomerFormValues,
} from "@/schema/customers.schema";
import useCustomerFns from "@/services/functions/customer.fns";

export type CustomerStatusActionMode = "blacklist" | "whitelist";

type CustomerStatusActionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
  mode: CustomerStatusActionMode;
};

type ModalStage = "FORM" | "SUCCESS";

const MODE_CONFIG: Record<
  CustomerStatusActionMode,
  {
    title: string;
    actionVerb: string;
    reasonOptions: { label: string; value: string }[];
    submitVariant: "danger" | "success";
    status: boolean;
    successTitle: string;
    successDescription: string;
  }
> = {
  blacklist: {
    title: "Blacklist Customer?",
    actionVerb: "blacklist",
    reasonOptions: [
      { label: "Fraudulent Transactions", value: "fraud" },
      { label: "Chargeback Abuse", value: "chargeback_abuse" },
      { label: "KYC Violation", value: "kyc_violation" },
      { label: "Suspicious Activity", value: "suspicious_activity" },
    ],
    submitVariant: "danger",
    status: true,
    successTitle: "Customer Blacklisted",
    successDescription: "This customer account access has been disabled across all platforms.",
  },
  whitelist: {
    title: "Whitelist Customer?",
    actionVerb: "whitelist",
    reasonOptions: [
      { label: "Wrongful Blacklisting", value: "innocent" },
      { label: "Issue Resolved", value: "resolved" },
      { label: "Appeal Approved", value: "appeal_approved" },
    ],
    submitVariant: "success",
    status: false,
    successTitle: "Customer Whitelisted",
    successDescription: "This customer account access has been restored across all platforms.",
  },
};

const DEFAULT_VALUES: BlacklistCustomerFormValues = {
  reason: "",
  notice: "",
};

export function CustomerStatusActionModal({
  open,
  onOpenChange,
  customerId,
  customerName,
  mode,
}: CustomerStatusActionModalProps) {
  const [currentStage, setCurrentStage] = React.useState<ModalStage>("FORM");
  const formId = React.useId();
  const { blacklistCustomer, loading } = useCustomerFns();
  const config = MODE_CONFIG[mode];

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<BlacklistCustomerFormValues>({
    resolver: zodResolver(blacklistCustomerSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const onSubmit = async (values: BlacklistCustomerFormValues) => {
    await blacklistCustomer(
      customerId,
      { note: values.notice, reason: values.reason, status: config.status },
      () => setCurrentStage("SUCCESS"),
    );
  };

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: false,
      contentClassName: "max-w-[650px]",
      content: (
        <div className="space-y-6">
          <ModalShell.Header
            title={config.title}
            description={
              <>
                You are about to {config.actionVerb}{" "}
                <span className="font-semibold text-text-black">{customerName}</span>.{" "}
                {mode === "blacklist"
                  ? "This will immediately disable their access across all platforms."
                  : "This will immediately restore their access across all platforms."}{" "}
                Select a reason to proceed.
              </>
            }
          />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="reason"
                label={`Reason For ${mode === "blacklist" ? "Blacklist" : "Whitelist"}`}
                required
              >
                {({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormSelectTrigger>
                      <SelectValue>
                        {(selectedValue: string | null) => {
                          if (!selectedValue) return "Select Reason";
                          const selected = config.reasonOptions.find(
                            (option) => option.value === selectedValue,
                          );
                          return selected ? selected.label : selectedValue;
                        }}
                      </SelectValue>
                    </FormSelectTrigger>
                    <SelectContent>
                      {config.reasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>

              <FormField control={control} name="notice" label="Compliance Notice" required>
                {({ field }) => (
                  <FormControl>
                    <Textarea {...field} placeholder="Enter remark" className="min-h-[160px] " />
                  </FormControl>
                )}
              </FormField>
            </form>
          </ModalShell.Body>

          <ModalShell.Footer className="pt-2">
            <ModalShell.Action
              type="button"
              variant="grey-stroke"
              onClick={() => onOpenChange(false)}
            >
              No, Cancel
            </ModalShell.Action>
            <ModalShell.Action
              type="submit"
              form={formId}
              variant={config.submitVariant}
              disabled={!isValid || loading.BLACKLIST_CUSTOMER}
              pending={loading.BLACKLIST_CUSTOMER}
            >
              Yes, Confirm
            </ModalShell.Action>
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={config.successTitle}
          description={config.successDescription}
          onClose={() => onOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[currentStage];

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick={closeOnBackdropClick}
      shellClassName={contentClassName}
    >
      {content}
    </ModalShell.Root>
  );
}
