import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";
import type { AssetClassConfigSectionsType } from "@/types/asset-management.type";

/**
 * Resolves the effective asset configuration from the override precedence chain:
 * class is the base, an item override wins over the class, and a category override
 * is the highest precedence, winning over both. Field-by-field, later layers win.
 */
export function resolveAssetConfig(
  classConfig: AssetClassConfigFormValues,
  itemConfig?: Partial<AssetClassConfigFormValues>,
  categoryConfig?: Partial<AssetClassConfigFormValues>,
): AssetClassConfigFormValues {
  return {
    ...classConfig,
    ...itemConfig,
    ...categoryConfig,
  };
}

/**
 * Maps a fetched asset class's (or category's override) GET-response-shaped
 * 8 config sections onto the form values (POST/form shape). Every section is
 * identically shaped between the two except valuationLogic (see
 * CreateAssetClassPayloadType vs AssetClassType) — mapped explicitly here so
 * every consumer (class, item, and category config forms) stays in sync.
 */
export function mapAssetClassToConfigFormValues(
  sections: AssetClassConfigSectionsType,
): AssetClassConfigFormValues {
  return {
    valuationLogic: {
      method: sections.valuationLogic.method,
      valuationProvider: sections.valuationLogic.valuationProvider,
      requiresSecondOpinion: sections.valuationLogic.requiresSecondOpinion,
      valuationDriftAlertsEnabled: sections.valuationLogic.valuationDriftAlertsEnabled,
      driftRate: sections.valuationLogic.valuationDriftPercentage,
      canOverridePriceManually: sections.valuationLogic.allowManualPriceOverride,
    },
    liquidityProfile: sections.liquidityProfile,
    loanEligibility: sections.loanEligibility,
    purchaseOfferLogic: sections.purchaseOfferLogic,
    marketPlace: sections.marketPlace,
    riskSettings: sections.riskSettings,
    underwritingControls: sections.underwritingControls,
    investorEligibility: sections.investorEligibility,
  };
}
