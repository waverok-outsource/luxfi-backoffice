"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField } from "@/components/util/form-controller";
import { AssetClassConfigWizard } from "@/module/dashboard/asset-management/components/asset-class-config-wizard";
import { ASSET_CLASS_STEP_ORDER } from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import {
  ASSET_CLASS_STEP_FIELDS,
  addAssetClassSchema,
  type AddAssetClassFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import type {
  AssetClassAssetType,
  AssetClassStatus,
  AssetClassType,
} from "@/types/asset-management.type";

type AddAssetClassModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the modal edits this asset class instead of creating a new one. */
  assetClass?: AssetClassType;
  onAssetClassCreated?: (assetClass: AssetClassType) => void;
  onAssetClassUpdated?: (assetClassId: string, patch: Partial<AssetClassType>) => void;
};

type ModalStage = "FORM" | "SUCCESS";

const HEADER_FIELDS: (keyof AddAssetClassFormValues)[] = ["assetClassName", "assetType"];

const BASE_DEFAULT_VALUES: AddAssetClassFormValues = {
  assetClassName: "",
  assetType: "",
  overwriteParentClassConfigurations: true,

  valuationMethod: "",
  approvedValuationProvider: "",
  overridePriceFeedManually: false,
  requireSecondOpinionValuation: false,
  alertOnValuationDrift: false,

  liquidityLevel: "",
  redemptionWindow: "",
  expectedSettlementDays: "",
  liquidityMaturityPeriodDays: "",
  maxIlliquidityCapPercent: 30,
  secondaryMarketTradeable: false,
  gateRedemptionsUnderStress: false,

  eligibleAsLoanCollateral: false,
  minimumLoanAmount: "",
  maximumLoanAmount: "",
  maximumLtvRatioPercent: 30,
  supportedLoanTenures: [],
  acceptedCollateralCurrencies: [],

  minimumOfferThreshold: "",
  offerValidityWindowDays: "",
  maxCounteroffersAllowed: "",
  offerEscrowHoldHours: "",
  enableCounterofferFlow: false,
  bindingOfferTriggersEscrow: false,
  adminApprovalRequiredForAcceptance: false,
  autoAcceptThresholdPercent: 95,
  defaultOfferMechanism: "",

  listOnMarketplace: false,
  featuredPlacementEligible: false,
  commissionRatePercent: "",
  listingExpiryDays: "",
  priceVisibility: "",

  riskCategory: "",
  stressTestModel: "",
  maxPortfolioConcentrationPercent: 70,
  correlatedRiskAdjustmentFactorPercent: 70,
  varThresholdPercent: 5,
  requireRiskCommitteeSignOff: false,
  autoMarginCallOnLtvBreach: false,
  restrictNewOriginationsUnderStress: false,
  correlatedAssetClasses: [],

  manualUnderwritingRequired: false,
  enableAutomatedCreditScoring: false,
  relationshipManagerApprovalRequired: false,
  underwritingSlaHours: "",
  kycLevelRequired: "",
  autoApprovalThreshold: "",
  minimumCreditScore: "",

  minimumInvestment: "",
  maximumSingleInvestorExposure: "",
  eligibleInvestorProfiles: [],
  accreditationVerificationRequired: false,
  suitabilityAssessmentRequired: false,
  advisorSignOffRequired: false,
  lockInvestorOnceCommitted: false,
};

function buildDefaultValues(assetClass?: AssetClassType): AddAssetClassFormValues {
  if (!assetClass) {
    return BASE_DEFAULT_VALUES;
  }

  return {
    ...BASE_DEFAULT_VALUES,
    ...assetClass.config,
    assetClassName: assetClass.name,
    assetType: assetClass.assetType,
    overwriteParentClassConfigurations: assetClass.overwriteParentClassConfigurations,
  };
}

function splitFormValues(values: AddAssetClassFormValues) {
  const { assetClassName, assetType, overwriteParentClassConfigurations, ...config } = values;
  return { assetClassName, assetType, overwriteParentClassConfigurations, config };
}

function buildMockAssetClass(
  values: AddAssetClassFormValues,
  status: AssetClassStatus,
): AssetClassType {
  const { assetClassName, assetType, overwriteParentClassConfigurations, config } =
    splitFormValues(values);

  return {
    assetClassId: `AC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name: assetClassName.trim() || "Untitled Asset Class",
    assetType: (assetType || "tangible") as AssetClassAssetType,
    status,
    assetsCount: 0,
    createdAt: new Date().toISOString(),
    overwriteParentClassConfigurations,
    config,
  };
}

function buildAssetClassPatch(values: AddAssetClassFormValues): Partial<AssetClassType> {
  const { assetClassName, assetType, overwriteParentClassConfigurations, config } =
    splitFormValues(values);

  return {
    name: assetClassName.trim() || "Untitled Asset Class",
    assetType: (assetType || "tangible") as AssetClassAssetType,
    overwriteParentClassConfigurations,
    config,
  };
}

export function AddAssetClassModal({
  open,
  onOpenChange,
  assetClass,
  onAssetClassCreated,
  onAssetClassUpdated,
}: AddAssetClassModalProps) {
  const isEditMode = Boolean(assetClass);
  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [activeStep, setActiveStep] = React.useState<AssetClassStepKey>(ASSET_CLASS_STEP_ORDER[0]);
  const [completedSteps, setCompletedSteps] = React.useState<Set<AssetClassStepKey>>(new Set());
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const formId = React.useId();

  const { control, trigger, getValues, handleSubmit } = useForm<AddAssetClassFormValues>({
    resolver: zodResolver(addAssetClassSchema),
    defaultValues: buildDefaultValues(assetClass),
    mode: "all",
  });

  const stepIndex = ASSET_CLASS_STEP_ORDER.indexOf(activeStep);
  const isLastStep = stepIndex === ASSET_CLASS_STEP_ORDER.length - 1;

  const handleStepSelect = (step: AssetClassStepKey) => {
    if (step === activeStep || !completedSteps.has(step)) {
      return;
    }

    setActiveStep(step);
  };

  const handleNext = async () => {
    const fieldsToValidate = [...HEADER_FIELDS, ...ASSET_CLASS_STEP_FIELDS[activeStep]];
    const isStepValid = await trigger(fieldsToValidate);

    if (!isStepValid) {
      return;
    }

    setCompletedSteps((previous) => new Set(previous).add(activeStep));
    setActiveStep(ASSET_CLASS_STEP_ORDER[stepIndex + 1]);
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      return;
    }

    setActiveStep(ASSET_CLASS_STEP_ORDER[stepIndex - 1]);
  };

  const handleSaveDraft = async () => {
    const isHeaderValid = await trigger(HEADER_FIELDS);

    if (!isHeaderValid) {
      return;
    }

    setIsSavingDraft(true);
    onAssetClassCreated?.(buildMockAssetClass(getValues(), "draft"));
    setIsSavingDraft(false);
    onOpenChange(false);
  };

  const onSubmit = (values: AddAssetClassFormValues) => {
    if (isEditMode && assetClass) {
      onAssetClassUpdated?.(assetClass.assetClassId, buildAssetClassPatch(values));
    } else {
      onAssetClassCreated?.(buildMockAssetClass(values, "published"));
    }

    setStage("SUCCESS");
  };

  const modalTitle =
    stepIndex === 0
      ? isEditMode
        ? "Edit Asset Class"
        : "Add Asset Class"
      : "Asset Class Configuration";

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[960px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title={modalTitle}
            description="Manage and configure Asset Class"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <ModalShell.Body className="bg-transparent p-0">
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="assetClassName"
                label="Asset Class Name"
                required
                className="max-w-md"
              >
                {({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Enter here" />
                  </FormControl>
                )}
              </FormField>

              <FormField control={control} name="assetType">
                {({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-4">
                      <FieldLabel>
                        Asset Type<span className="text-red-500">*</span>
                      </FieldLabel>

                      <ToggleGroup
                        selection="single"
                        look="segmented"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ToggleGroupItem value="intangible">
                          Intangible (Digital) Assets
                        </ToggleGroupItem>
                        <ToggleGroupItem value="tangible">Tangible Assets</ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {fieldState.error ? (
                      <FieldError errors={[{ message: fieldState.error.message }]} />
                    ) : null}
                  </div>
                )}
              </FormField>

              <AssetClassConfigWizard
                control={control}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onStepSelect={handleStepSelect}
              />
            </form>
          </ModalShell.Body>

          <ModalShell.Footer align="between">
            <div>
              {stepIndex > 0 ? (
                <ModalShell.Action type="button" variant="grey-stroke" onClick={handleBack}>
                  Back
                </ModalShell.Action>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              {isEditMode ? null : (
                <ModalShell.Action
                  type="button"
                  variant="grey-stroke"
                  pending={isSavingDraft}
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </ModalShell.Action>
              )}

              {isLastStep ? (
                <ModalShell.Action type="submit" form={formId}>
                  {isEditMode ? "Update" : "Upload"}
                </ModalShell.Action>
              ) : (
                <ModalShell.Action type="button" onClick={handleNext}>
                  Next
                </ModalShell.Action>
              )}
            </div>
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={isEditMode ? "Asset Class Updated" : "Asset Class Created"}
          description={
            isEditMode
              ? "Asset Class configuration has been updated successfully"
              : "New Asset Class has been created succesfully"
          }
          onClose={() => onOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[stage];

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
