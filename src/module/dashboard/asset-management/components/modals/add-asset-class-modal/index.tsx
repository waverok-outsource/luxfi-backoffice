"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormTextarea } from "@/components/util/form-controller";
import { AssetClassConfigWizard } from "@/module/dashboard/asset-management/components/asset-class-config-wizard";
import { ASSET_CLASS_STEP_ORDER } from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import {
  ASSET_CLASS_STEP_FIELDS,
  addAssetClassSchema,
  type AddAssetClassFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import { useAssetClassTypes } from "@/services/queries/asset-management.queries";
import useAssetManagementFns from "@/services/functions/asset-management.fns";
import type {
  AssetClassAssetType,
  AssetClassStatus,
  AssetClassType,
  CreateAssetClassPayloadType,
} from "@/types/asset-management.type";
import { mapAssetClassToConfigFormValues } from "@/util/resolve-asset-config";
import { toTitleCase } from "@/util/helper";

const ASSET_TYPE_LABELS: Record<string, string> = {
  tangible: "Tangible Assets",
  digital: "Digital Assets",
};

type AddAssetClassModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the modal edits this asset class instead of creating a new one. */
  assetClass?: AssetClassType;
};

type ModalStage = "FORM" | "SUCCESS";

const HEADER_FIELDS: (keyof AddAssetClassFormValues)[] = ["name", "assetType", "description"];

const BASE_DEFAULT_VALUES: AddAssetClassFormValues = {
  name: "",
  assetType: "",
  description: "",
  status: "active",

  valuationLogic: {
    method: "",
    valuationProvider: "",
    requiresSecondOpinion: false,
    valuationDriftAlertsEnabled: false,
    driftRate: 15,
    canOverridePriceManually: false,
  },

  liquidityProfile: {
    liquidityLevel: "",
    redemptionTiming: "",
    expectedSettlement: { value: 7, unit: "days" },
    liquidityMaturity: { value: 7, unit: "days" },
    restrictRedemptionDuringStress: false,
    canTradeOnSecondaryMarket: false,
    maxPortfolioAllocationPercent: 30,
  },

  loanEligibility: {
    minLoanAmount: 0,
    loanCurrency: "",
    maxLoanAmount: 0,
    maxLtv: 30,
    loanTenure: [],
    acceptedCollateralCurrencies: [],
  },

  purchaseOfferLogic: {
    minOfferAmount: 0,
    offerValidity: { value: 7, unit: "days" },
    maxCounterOffers: 3,
    escrowHoldHours: 24,
    allowsCounterOffer: false,
    canOfferTriggerEscrow: false,
    requiresApproval: false,
    offerPattern: "",
    autoAcceptancePercentage: 95,
  },

  marketPlace: {
    priceVisibilityPattern: "",
    commission: { value: 5, type: "percentage" },
    listingExpiry: { value: 30, unit: "days" },
    canFeature: false,
    canList: false,
  },

  riskSettings: {
    riskCategory: "",
    stressTestModel: "",
    maxAllowedPortfolioPerClient: 70,
    riskAdjustmentFactor: 70,
    valueAtRiskThreshold: 5,
    requiresWriteOff: false,
    allowsAutoMarginCall: false,
    restrictTradingDuringStress: false,
    correlatedClasses: [],
  },

  underwritingControls: {
    canManuallyUnderwrite: false,
    requiresApproval: false,
    usesAutomatedCreditScoring: false,
    kycTierRequired: "",
    minCreditScore: 0,
    autoApprovalAmount: 0,
    autoApprovalCurrency: "",
    underwritingSla: { value: 3, unit: "days" },
  },

  investorEligibility: {
    investmentAmount: { min: 0, max: 0, currency: "" },
    lockOnCommit: false,
    checkSuitability: false,
    requiresAdvisorApproval: false,
    requiresAccreditation: false,
    investorProfilesAllowed: [],
  },
};

function buildDefaultValues(assetClass?: AssetClassType): AddAssetClassFormValues {
  if (!assetClass) {
    return BASE_DEFAULT_VALUES;
  }

  return {
    name: assetClass.name,
    assetType: assetClass.assetType,
    description: assetClass.description,
    status: assetClass.status,
    ...mapAssetClassToConfigFormValues(assetClass),
  };
}

function buildCreateAssetClassPayload(
  values: AddAssetClassFormValues,
  status: AssetClassStatus,
): CreateAssetClassPayloadType {
  return {
    ...values,
    name: values.name.trim() || "Untitled Asset Class",
    assetType: values.assetType as AssetClassAssetType,
    status,
  };
}

export function AddAssetClassModal({ open, onOpenChange, assetClass }: AddAssetClassModalProps) {
  const isEditMode = Boolean(assetClass);
  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [activeStep, setActiveStep] = React.useState<AssetClassStepKey>(ASSET_CLASS_STEP_ORDER[0]);
  const [completedSteps, setCompletedSteps] = React.useState<Set<AssetClassStepKey>>(new Set());
  const formId = React.useId();

  const { createAssetClass, updateAssetClass, loading } = useAssetManagementFns();
  const { data: assetClassTypesResponse } = useAssetClassTypes();
  const assetTypeOptions = assetClassTypesResponse?.data ?? ["tangible", "digital"];

  const { control, trigger, getValues, handleSubmit } = useForm<AddAssetClassFormValues>({
    // zodResolver's inferred type reflects the schema's pre-coercion input (numeric
    // fields as `unknown`, since it uses z.coerce.number()), which structurally
    // conflicts with the post-coercion AddAssetClassFormValues type. Runtime coercion
    // is unaffected; this only satisfies the static check.
    resolver: zodResolver(addAssetClassSchema) as unknown as Resolver<AddAssetClassFormValues>,
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

    await createAssetClass(buildCreateAssetClassPayload(getValues(), "draft"), () =>
      onOpenChange(false),
    );
  };

  const onSubmit = (values: AddAssetClassFormValues) => {
    if (isEditMode && assetClass) {
      updateAssetClass(
        assetClass.assetClassId,
        buildCreateAssetClassPayload(values, assetClass.status),
        () => setStage("SUCCESS"),
      );
      return;
    }

    createAssetClass(buildCreateAssetClassPayload(values, "active"), () => setStage("SUCCESS"));
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
                name="name"
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

              <FormField control={control} name="description" label="Description" required>
                {({ field }) => <FormTextarea {...field} placeholder="Enter description" />}
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
                        {assetTypeOptions.map((assetType) => (
                          <ToggleGroupItem key={assetType} value={assetType}>
                            {ASSET_TYPE_LABELS[assetType] ?? toTitleCase(assetType)}
                          </ToggleGroupItem>
                        ))}
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
                  pending={loading.CREATE_ASSET_CLASS}
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </ModalShell.Action>
              )}

              {isLastStep ? (
                <ModalShell.Action
                  type="submit"
                  form={formId}
                  pending={isEditMode ? loading.UPDATE_ASSET_CLASS : loading.CREATE_ASSET_CLASS}
                >
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
