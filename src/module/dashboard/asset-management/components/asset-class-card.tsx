"use client";

import { Settings2, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssetClassType } from "@/types/asset-management.type";

type AssetClassCardProps = {
  assetClass: AssetClassType;
  onEdit: () => void;
  onViewAssets: () => void;
};

export function AssetClassCard({ assetClass, onEdit, onViewAssets }: AssetClassCardProps) {
  const isConfigured = assetClass.status !== "draft";
  const typeLabel =
    assetClass.assetType === "tangible" ? "Tangible Luxury Assets" : "Digital Asset";

  return (
    <article
      className={cn(
        "rounded-2xl bg-primary-grey-undertone p-4 md:p-5",
        !isConfigured && "opacity-60",
      )}
    >
      <h3 className="font-semibold text-text-black">{assetClass.name}</h3>

      <Badge variant="neutral" className="mt-2 gap-1.5">
        <Tag className="size-3" />
        {typeLabel}
      </Badge>

      <div className="mt-4 flex items-center gap-2">
        <Button
          type="button"
          variant="grey-stroke"
          size="sm"
          className="flex-1 rounded-xl"
          onClick={onEdit}
        >
          <Settings2 className="size-4" />
          Edit
        </Button>
        <Button
          type="button"
          variant="gold"
          size="sm"
          className="flex-1 rounded-xl"
          disabled={!isConfigured}
          onClick={onViewAssets}
        >
          View Assets
        </Button>
      </div>
    </article>
  );
}
