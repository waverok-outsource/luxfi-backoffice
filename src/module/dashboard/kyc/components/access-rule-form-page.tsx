"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField, FormSelectTrigger, FormSwitchField } from "@/components/util/form-controller";
import { blankAccessForm, resourceTitle, ruleToAccessForm, tierLabel } from "@/module/dashboard/kyc/access";
import { kycAccessFormSchema, type KycAccessFormValues } from "@/schema/kyc.schema";
import useKycAccessFns from "@/services/functions/kyc-access.fns";
import { useKycAccessResources, useKycAccessRule, useKycAccessRules } from "@/services/queries/kyc-access.queries";
import { useKycTiers } from "@/services/queries/kyc.queries";
import type { KycAccessResource, KycTier } from "@/types/kyc.type";
import route from "@/util/route";

const EXISTING_RULES_QUERY = "page=1&limit=100";

type AccessRuleFormPageProps = {
  ruleId?: string;
};

export function AccessRuleFormPage({ ruleId }: AccessRuleFormPageProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useKycAccessRule(ruleId ?? "");
  const rule = data?.data ?? null;

  if (ruleId && isLoading && !rule) {
    return <StatusMessage message="Loading access rule..." />;
  }

  if (ruleId && (isError || !rule)) {
    return (
      <StatusMessage
        message="This access rule could not be loaded."
        actionLabel="Back to resource access"
        onAction={() => router.push(route.dashboard.kycResourceAccess)}
      />
    );
  }

  return (
    <AccessRuleForm
      key={rule ? `${rule.kycAccessRef}-${rule.updatedAt}` : "new"}
      ruleId={rule?.kycAccessRef}
      defaultValues={rule ? ruleToAccessForm(rule) : blankAccessForm()}
      title={rule ? resourceTitle(rule.resource?.title) : "New rule"}
      currentResource={rule?.resource}
      currentTierId={rule?.minimumKycTier?.kycRef}
      currentTierLabel={rule ? tierLabel(rule.minimumKycTier) : undefined}
    />
  );
}

function AccessRuleForm({
  ruleId,
  defaultValues,
  title,
  currentResource,
  currentTierId,
  currentTierLabel,
}: {
  ruleId?: string;
  defaultValues: KycAccessFormValues;
  title: string;
  currentResource?: KycAccessResource;
  currentTierId?: string;
  currentTierLabel?: string;
}) {
  const router = useRouter();
  const formId = "kyc-access-rule-form";
  const { createRule, updateRule, loading } = useKycAccessFns();
  const resourcesQuery = useKycAccessResources();
  const tiersQuery = useKycTiers("limit=100");
  const rulesQuery = useKycAccessRules(EXISTING_RULES_QUERY);
  const { control, handleSubmit } = useForm<KycAccessFormValues>({
    resolver: zodResolver(kycAccessFormSchema) as unknown as Resolver<KycAccessFormValues>,
    defaultValues,
  });

  const resources = useMemo(() => {
    const taken = new Set(
      (rulesQuery.data?.data ?? [])
        .filter((rule) => rule.kycAccessRef !== ruleId)
        .map((rule) => rule.resource?.resourceRef)
        .filter(Boolean),
    );
    const available = (resourcesQuery.data?.data ?? []).filter(
      (resource) => !rulesQuery.isSuccess || !taken.has(resource.resourceRef),
    );
    if (
      currentResource?.resourceRef &&
      !available.some((resource) => resource.resourceRef === currentResource.resourceRef)
    ) {
      return [currentResource, ...available];
    }
    return available;
  }, [currentResource, resourcesQuery.data, ruleId, rulesQuery.data, rulesQuery.isSuccess]);

  const tiers = useMemo(() => {
    return [...(tiersQuery.data?.data ?? [])].sort((a, b) => a.tierNumber - b.tierNumber);
  }, [tiersQuery.data]);

  const tierChoices = useMemo(() => {
    const choices = tiers.map((tier) => ({
      id: tier.kycRef,
      label: tierOptionLabel(tier),
    }));
    if (currentTierId && !choices.some((tier) => tier.id === currentTierId)) {
      choices.unshift({
        id: currentTierId,
        label: currentTierLabel || "Current tier",
      });
    }
    return choices;
  }, [currentTierId, currentTierLabel, tiers]);

  const onSubmit = async (values: KycAccessFormValues) => {
    const saved = ruleId
      ? await updateRule(ruleId, {
          resourceId: values.resourceId,
          kycTierId: values.kycTierId,
          isActive: values.isActive,
        })
      : await createRule({
          resourceId: values.resourceId,
          kycTierId: values.kycTierId,
          isActive: values.isActive,
        });
    if (!saved) return;
    router.push(route.dashboard.kycResourceAccessRule(saved.kycAccessRef));
  };

  const optionsLoading = resourcesQuery.isLoading || tiersQuery.isLoading || rulesQuery.isLoading;
  const noResourcesLeft = !ruleId && rulesQuery.isSuccess && resources.length === 0;

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="KYC"
        entityId={title}
        idPrefix=""
        onBack={() =>
          router.push(
            ruleId ? route.dashboard.kycResourceAccessRule(ruleId) : route.dashboard.kycResourceAccess,
          )
        }
      />

      <form
        id={formId}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, () => {
          toast.error("Select a resource and a KYC tier.");
        })}
      >
        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Access rule</h2>
            <p className="mt-1 text-sm text-text-grey">
              Customers need this KYC tier, or a higher one, before they can use the resource. One
              rule is allowed per resource. An inactive rule stays on record and is not enforced.
            </p>
          </div>

          {resourcesQuery.isError || tiersQuery.isError ? (
            <p className="text-sm text-text-red">
              Resources or KYC tiers could not be loaded. Refresh and try again.
            </p>
          ) : null}
          {noResourcesLeft ? (
            <p className="text-sm text-text-grey">
              Every resource already has a rule. Open an existing rule to change its tier or status.
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <FormField control={control} name="resourceId" label="Resource" required>
              {({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => {
                    if (typeof value === "string") field.onChange(value);
                  }}
                  disabled={optionsLoading || noResourcesLeft}
                >
                  <FormSelectTrigger>
                    <SelectValue>
                      {(selected: string | null) => {
                        const resource = resources.find((item) => item.resourceRef === selected);
                        return resource ? resourceTitle(resource.title) : "Select a resource";
                      }}
                    </SelectValue>
                  </FormSelectTrigger>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.resourceRef} value={resource.resourceRef}>
                        {resourceOptionLabel(resource)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField control={control} name="kycTierId" label="Minimum KYC tier" required>
              {({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => {
                    if (typeof value === "string") field.onChange(value);
                  }}
                  disabled={optionsLoading || tierChoices.length === 0}
                >
                  <FormSelectTrigger>
                    <SelectValue>
                      {(selected: string | null) =>
                        tierChoices.find((tier) => tier.id === selected)?.label ?? "Select a KYC tier"
                      }
                    </SelectValue>
                  </FormSelectTrigger>
                  <SelectContent>
                    {tierChoices.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
          </div>

          <FormSwitchField
            control={control}
            name="isActive"
            label="Active"
            description="Turn this off to keep the rule without enforcing it."
          />
        </section>
      </form>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(
              ruleId
                ? route.dashboard.kycResourceAccessRule(ruleId)
                : route.dashboard.kycResourceAccess,
            )
          }
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form={formId}
          pending={loading.CREATE_RULE || loading.UPDATE_RULE}
          disabled={optionsLoading || noResourcesLeft || tierChoices.length === 0}
        >
          {ruleId ? "Save changes" : "Create rule"}
        </Button>
      </div>
    </div>
  );
}

function resourceOptionLabel(resource: KycAccessResource) {
  const title = resourceTitle(resource.title);
  const description = resource.description?.trim();
  if (!description || description.toLowerCase() === resource.title?.trim().toLowerCase()) {
    return title;
  }
  return `${title} — ${description}`;
}

function tierOptionLabel(tier: KycTier) {
  const label = tierLabel(tier);
  return tier.isActive === false ? `${label} (inactive)` : label;
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
