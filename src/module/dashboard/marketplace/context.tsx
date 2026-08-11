"use client";

import * as React from "react";

import { mockBuyOffers } from "@/module/dashboard/marketplace/data";
import type { BuyOfferType } from "@/types/marketplace.type";

type BuyOffersContextValue = {
  offers: BuyOfferType[];
  updateOffer: (offerId: string, patch: Partial<BuyOfferType>) => void;
};

const BuyOffersContext = React.createContext<BuyOffersContextValue | null>(null);

export function BuyOffersProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = React.useState<BuyOfferType[]>(mockBuyOffers);

  const updateOffer = React.useCallback((offerId: string, patch: Partial<BuyOfferType>) => {
    setOffers((previous) =>
      previous.map((offer) => (offer.offerId === offerId ? { ...offer, ...patch } : offer)),
    );
  }, []);

  const value = React.useMemo(() => ({ offers, updateOffer }), [offers, updateOffer]);

  return <BuyOffersContext.Provider value={value}>{children}</BuyOffersContext.Provider>;
}

export function useBuyOffersContext() {
  const context = React.useContext(BuyOffersContext);

  if (!context) {
    throw new Error("useBuyOffersContext must be used within BuyOffersProvider");
  }

  return context;
}
