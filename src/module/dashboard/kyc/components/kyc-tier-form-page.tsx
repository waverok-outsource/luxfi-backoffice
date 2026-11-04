"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
  FormTextarea,
} from "@/components/util/form-controller";
import { RequirementEditor } from "@/module/dashboard/kyc/components/requirement-editor";
import { severityLabel, tierToFormValues, toKycTierPayload, blankTierForm } from "@/module/dashboard/kyc/form";
import { kycTierFormSchema, type KycTierFormValues } from "@/schema/kyc.schema";
import useKycFns from "@/services/functions/kyc.fns";
import { useKycTier } from "@/services/queries/kyc.queries";
import { KYC_SEVERITIES } from "@/types/kyc.type";
import route from "@/util/route";

type KycTierFormPageProps = {
  kycRef?: string;
};

export function KycTierFormPage({ kycRef }: KycTierFormPageProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useKycTier(kycRef ?? "");
  const tier = data?.data ?? null;

  if (kycRef && isLoading && !tier) {
    return <StatusMessage message="Loading configuration..." />;
  }

  if (kycRef && (isError || !tier)) {
    return (
      <StatusMessage
        message="This configuration could not be loaded."
        actionLabel="Back to KYC"
        onAction={() => router.push(route.dashboard.kyc)}
      />
    );
  }

  return (
    <KycTierForm
      key={tier ? `${tier.kycRef}-${tier.updatedAt}` : "new"}
      kycRef={tier?.kycRef}
      defaultValues={tier ? tierToFormValues(tier) : blankTierForm()}
      title={tier ? tier.title : "New configuration"}
    />
  );
}

function KycTierForm({
  kycRef,
  defaultValues,
  title,
}: {
  kycRef?: string;
  defaultValues: KycTierFormValues;
  title: string;
}) {
  const router = useRouter();
  const formId = "kyc-tier-form";
  const { saveTier, loading } = useKycFns();
  const { control, handleSubmit, formState } = useForm<KycTierFormValues>({
    resolver: zodResolver(kycTierFormSchema) as unknown as Resolver<KycTierFormValues>,
    defaultValues,
  });

  const onSubmit = async (values: KycTierFormValues) => {
    const saved = await saveTier(toKycTierPayload(values), kycRef);
    if (!saved) return;
    router.push(route.dashboard.kycConfiguration(saved.kycRef));
  };

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="KYC"
        entityId={title}
        idPrefix=""
        onBack={() => router.push(kycRef ? route.dashboard.kycConfiguration(kycRef) : route.dashboard.kyc)}
      />

      <form
        id={formId}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, () => {
          toast.error("Check the highlighted fields and try again.");
        })}
      >
        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Tier details</h2>
            <p className="mt-1 text-sm text-text-grey">
              A tier is the configuration customers complete before they can move to the next level.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField control={control} name="title" label="Title" required>
              {({ field }) => (
                <FormControl>
                  <Input {...field} placeholder="Identity Verification" />
                </FormControl>
              )}
            </FormField>
            <FormField control={control} name="tierNumber" label="Tier number" required>
              {({ field }) => (
                <FormControl>
                  <Input {...field} inputMode="numeric" placeholder="2" />
                </FormControl>
              )}
            </FormField>
            <FormField control={control} name="severity" label="Severity" required>
              {({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (typeof value === "string") field.onChange(value);
                  }}
                >
                  <FormSelectTrigger>
                    <SelectValue>
                      {(selected: string | null) =>
                        selected ? severityLabel(selected) : "Select severity"
                      }
                    </SelectValue>
                  </FormSelectTrigger>
                  <SelectContent>
                    {KYC_SEVERITIES.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severityLabel(severity)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
            <FormField control={control} name="provider" label="Provider" description="Optional verification provider.">
              {({ field }) => (
                <FormControl>
                  <Input {...field} placeholder="dojah" />
                </FormControl>
              )}
            </FormField>
            <FormField control={control} name="riskMin" label="Risk band minimum" required>
              {({ field }) => (
                <FormControl>
                  <Input {...field} inputMode="decimal" placeholder="40" />
                </FormControl>
              )}
            </FormField>
            <FormField control={control} name="riskMax" label="Risk band maximum" required>
              {({ field }) => (
                <FormControl>
                  <Input {...field} inputMode="decimal" placeholder="80" />
                </FormControl>
              )}
            </FormField>
          </div>

          <FormField control={control} name="description" label="Description">
            {({ field }) => (
              <FormTextarea
                {...field}
                placeholder="Verify your identity to access asset trading"
              />
            )}
          </FormField>

          <FormSwitchField
            control={control}
            name="isActive"
            label="Active"
            description="Inactive tiers stay on record and are hidden from new customer submissions."
          />
        </section>

        <RequirementEditor control={control} errors={formState.errors} />
      </form>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(kycRef ? route.dashboard.kycConfiguration(kycRef) : route.dashboard.kyc)
          }
        >
          Cancel
        </Button>
        <Button type="submit" form={formId} pending={loading.SAVE_TIER}>
          {kycRef ? "Save changes" : "Create configuration"}
        </Button>
      </div>
    </div>
  );
}

function StatusMessage({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
      <p className="text-text-grey">{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="text-sm text-primary-gold-brand underline" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
