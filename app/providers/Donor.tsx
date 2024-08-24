import React, { createContext, useContext, useState, useEffect } from "react";
import { Tables } from "../database.types";
import { supabase } from "@/lib/supabase";

import { Session, User } from "@supabase/supabase-js";

interface RequestContextType {
  selectedRequest: Tables<"donationRequest"> | null;
  setSelectedRequest: (request: Tables<"donationRequest">) => void;
  items: Tables<"item">[];
  donation: Tables<"donation">[]; // Added donation
  setItems: (items: Tables<"item">[]) => void;
  setDonation: (donations: Tables<"donation">[]) => void; // Added setDonation
}

const DonationContext = createContext<RequestContextType>({
  selectedRequest: null,
  setSelectedRequest: () => {},
  items: [],
  setItems: () => {},
  donation: [],
  setDonation: () => {},
});

interface DonorProviderProps {
  children: React.ReactNode;
}

export const DonorProvider: React.FC<DonorProviderProps> = ({ children }) => {
  const [selectedRequest, setSelectedRequest] =
    useState<Tables<"donationRequest"> | null>(null);
  const [items, setItems] = useState<Tables<"item">[]>([]);
  const [donation, setDonation] = useState<Tables<"donation">[]>([]);

  return (
    <DonationContext.Provider
      value={{
        selectedRequest,
        setSelectedRequest,
        items,
        setItems,
        donation,
        setDonation, // Added setDonation to the provider value
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonorContext = (): RequestContextType => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonorContext must be used within a DonorProvider");
  }
  return context;
};
