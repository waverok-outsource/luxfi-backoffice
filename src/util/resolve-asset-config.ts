import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

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
