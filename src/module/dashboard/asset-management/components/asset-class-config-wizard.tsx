"use client";

import type { Control } from "react-hook-form";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ASSET_CLASS_STEP_META,
  ASSET_CLASS_STEP_ORDER,
} from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import { InvestorEligibilityStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/investor-eligibility-step";
import { LiquidityProfileStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/liquidity-profile-step";
import { LoanEligibilityStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/loan-eligibility-step";
import { MarketplaceStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/marketplace-step";
import { PurchaseOfferStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/purchase-offer-step";
import { RiskParametersStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/risk-parameters-step";
import { UnderwritingStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/underwriting-step";
import { ValuationLogicStep } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal/steps/valuation-logic-step";
import type { AssetClassConfigFormValues, AssetClassStepKey } from "@/schema/asset-management.schema";

function renderStep<TFieldValues extends AssetClassConfigFormValues>(
  step: AssetClassStepKey,
  wideControl: Control<TFieldValues>,
) {
  // The step components are written against the narrower "config-only" slice
  // of the form (shared by the class, item-override, and future category-override
  // forms). Every caller's TFieldValues is a superset that merges this slice with
  // extra header fields, so the underlying form object always has these fields —
  // this cast just narrows the static type at the one seam that needs it, since
  // react-hook-form's Path<T> can't be inferred through an unresolved generic.
  const control = wideControl as unknown as Control<AssetClassConfigFormValues>;

  switch (step) {
    case "VALUATION_LOGIC":
      return <ValuationLogicStep control={control} />;
    case "LIQUIDITY_PROFILE":
      return <LiquidityProfileStep control={control} />;
    case "LOAN_ELIGIBILITY":
      return <LoanEligibilityStep control={control} />;
    case "PURCHASE_OFFER":
      return <PurchaseOfferStep control={control} />;
    case "MARKETPLACE":
      return <MarketplaceStep control={control} />;
    case "RISK_PARAMETERS":
      return <RiskParametersStep control={control} />;
    case "UNDERWRITING":
      return <UnderwritingStep control={control} />;
    case "INVESTOR_ELIGIBILITY":
      return <InvestorEligibilityStep control={control} />;
    default:
      return null;
  }
}

type AssetClassConfigWizardProps<TFieldValues extends AssetClassConfigFormValues> = {
  control: Control<TFieldValues>;
  activeStep: AssetClassStepKey;
  completedSteps: Set<AssetClassStepKey>;
  onStepSelect: (step: AssetClassStepKey) => void;
  className?: string;
};

/**
 * Shared 8-step configuration nav + content, used by the asset class modal
 * today and reused for per-item / per-category overrides.
 */
export function AssetClassConfigWizard<TFieldValues extends AssetClassConfigFormValues>({
  control,
  activeStep,
  completedSteps,
  onStepSelect,
  className,
}: AssetClassConfigWizardProps<TFieldValues>) {
  const stepIndex = ASSET_CLASS_STEP_ORDER.indexOf(activeStep);
  const stepMeta = ASSET_CLASS_STEP_META[activeStep];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 border-t border-primary-grey-stroke pt-5 lg:grid-cols-[220px_1fr]",
        className,
      )}
    >
      <nav className="flex flex-col gap-1">
        {ASSET_CLASS_STEP_ORDER.map((step, index) => {
          const meta = ASSET_CLASS_STEP_META[step];
          const isCompleted = completedSteps.has(step);
          const isCurrent = step === activeStep;
          const isReachable = isCompleted || isCurrent;

          return (
            <button
              key={step}
              type="button"
              disabled={!isReachable}
              onClick={() => onStepSelect(step)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                isCurrent
                  ? "bg-primary-gold-light text-primary-black"
                  : isCompleted
                    ? "text-text-black hover:bg-primary-grey-undertone"
                    : "cursor-not-allowed text-text-grey",
              )}
            >
              {isCompleted && !isCurrent ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-alert-success text-primary-white">
                  <Check className="size-3" />
                </span>
              ) : (
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    isCurrent
                      ? "bg-primary-black text-primary-white"
                      : "bg-primary-grey-stroke text-text-grey",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              {meta.label}
            </button>
          );
        })}
      </nav>

      <div>
        <p className="text-sm font-semibold text-text-grey">
          {stepIndex + 1}/{ASSET_CLASS_STEP_ORDER.length} - {stepMeta.title}
        </p>
        <p className="mt-1 text-sm text-text-grey">{stepMeta.description}</p>

        <div className="mt-4 rounded-2xl bg-primary-white p-4 sm:p-5">
          {renderStep(activeStep, control)}
        </div>
      </div>
    </div>
  );
}
