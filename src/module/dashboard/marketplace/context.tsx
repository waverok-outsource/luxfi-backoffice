"use client";

import * as React from "react";

import {
  mockBuyOffers,
  mockCustomerListings,
  mockLiquidationOffers,
  mockMarketplaceListings,
  mockP2PTradeRequests,
} from "@/module/dashboard/marketplace/data";
import type {
  BuyOfferType,
  CustomerListingType,
  LiquidationOfferType,
  MarketplaceListingType,
  P2PTradeRequestType,
} from "@/types/marketplace.type";

type MarketplaceListingsContextValue = {
  listings: MarketplaceListingType[];
  addListing: (listing: MarketplaceListingType) => void;
  updateListing: (listingId: string, patch: Partial<MarketplaceListingType>) => void;
  removeListing: (listingId: string) => void;
};

const MarketplaceListingsContext = React.createContext<MarketplaceListingsContextValue | null>(null);

export function MarketplaceListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = React.useState<MarketplaceListingType[]>(mockMarketplaceListings);

  const addListing = React.useCallback((listing: MarketplaceListingType) => {
    setListings((previous) => [listing, ...previous]);
  }, []);

  const updateListing = React.useCallback((listingId: string, patch: Partial<MarketplaceListingType>) => {
    setListings((previous) =>
      previous.map((listing) => (listing.listingId === listingId ? { ...listing, ...patch } : listing)),
    );
  }, []);

  const removeListing = React.useCallback((listingId: string) => {
    setListings((previous) => previous.filter((listing) => listing.listingId !== listingId));
  }, []);

  const value = React.useMemo(
    () => ({ listings, addListing, updateListing, removeListing }),
    [listings, addListing, updateListing, removeListing],
  );

  return <MarketplaceListingsContext.Provider value={value}>{children}</MarketplaceListingsContext.Provider>;
}

export function useMarketplaceListingsContext() {
  const context = React.useContext(MarketplaceListingsContext);

  if (!context) {
    throw new Error("useMarketplaceListingsContext must be used within MarketplaceListingsProvider");
  }

  return context;
}

type CustomerListingsContextValue = {
  listings: CustomerListingType[];
  updateListing: (listingId: string, patch: Partial<CustomerListingType>) => void;
};

const CustomerListingsContext = React.createContext<CustomerListingsContextValue | null>(null);

export function CustomerListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = React.useState<CustomerListingType[]>(mockCustomerListings);

  const updateListing = React.useCallback((listingId: string, patch: Partial<CustomerListingType>) => {
    setListings((previous) =>
      previous.map((listing) => (listing.listingId === listingId ? { ...listing, ...patch } : listing)),
    );
  }, []);

  const value = React.useMemo(() => ({ listings, updateListing }), [listings, updateListing]);

  return <CustomerListingsContext.Provider value={value}>{children}</CustomerListingsContext.Provider>;
}

export function useCustomerListingsContext() {
  const context = React.useContext(CustomerListingsContext);

  if (!context) {
    throw new Error("useCustomerListingsContext must be used within CustomerListingsProvider");
  }

  return context;
}

type LiquidationOffersContextValue = {
  offers: LiquidationOfferType[];
  updateOffer: (offerId: string, patch: Partial<LiquidationOfferType>) => void;
};

const LiquidationOffersContext = React.createContext<LiquidationOffersContextValue | null>(null);

export function LiquidationOffersProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = React.useState<LiquidationOfferType[]>(mockLiquidationOffers);

  const updateOffer = React.useCallback((offerId: string, patch: Partial<LiquidationOfferType>) => {
    setOffers((previous) =>
      previous.map((offer) => (offer.offerId === offerId ? { ...offer, ...patch } : offer)),
    );
  }, []);

  const value = React.useMemo(() => ({ offers, updateOffer }), [offers, updateOffer]);

  return <LiquidationOffersContext.Provider value={value}>{children}</LiquidationOffersContext.Provider>;
}

export function useLiquidationOffersContext() {
  const context = React.useContext(LiquidationOffersContext);

  if (!context) {
    throw new Error("useLiquidationOffersContext must be used within LiquidationOffersProvider");
  }

  return context;
}

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

type P2PTradeRequestsContextValue = {
  trades: P2PTradeRequestType[];
  updateTrade: (tradeId: string, patch: Partial<P2PTradeRequestType>) => void;
};

const P2PTradeRequestsContext = React.createContext<P2PTradeRequestsContextValue | null>(null);

export function P2PTradeRequestsProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = React.useState<P2PTradeRequestType[]>(mockP2PTradeRequests);

  const updateTrade = React.useCallback((tradeId: string, patch: Partial<P2PTradeRequestType>) => {
    setTrades((previous) =>
      previous.map((trade) => (trade.tradeId === tradeId ? { ...trade, ...patch } : trade)),
    );
  }, []);

  const value = React.useMemo(() => ({ trades, updateTrade }), [trades, updateTrade]);

  return <P2PTradeRequestsContext.Provider value={value}>{children}</P2PTradeRequestsContext.Provider>;
}

export function useP2PTradeRequestsContext() {
  const context = React.useContext(P2PTradeRequestsContext);

  if (!context) {
    throw new Error("useP2PTradeRequestsContext must be used within P2PTradeRequestsProvider");
  }

  return context;
}
