import React, { createContext, useContext, useState, useEffect } from "react";
import { Tables } from "@/app/database.types";
import { supabase } from "@/lib/supabase";

import { Session, User } from "@supabase/supabase-js";

interface RequestContextType {
  selectedRequest: Tables<"donation_requests_with_categories_and_tags"> | null;
  setSelectedRequest: (
    request: Tables<"donation_requests_with_categories_and_tags">
  ) => void;
  items: Tables<"item">[];
  donation: Tables<"donation">[]; // Added donation
  setItems: (items: Tables<"item">[]) => void;
  selectedItems: number[]; // Added setSelectedItems
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  setDonation: (donations: Tables<"donation">[]) => void; // Added setDonation
  createDonation: () => Promise<{ success: boolean; error?: string }>; // Added createDonation
}

const DonationContext = createContext<RequestContextType>({
  selectedRequest: null,
  setSelectedRequest: () => {},
  items: [],
  setItems: () => {},
  selectedItems: [], // Added selectedItems
  setSelectedItems: () => {}, // Added
  donation: [],
  setDonation: () => {},
  createDonation: async () => ({ success: false }), // Added createDonation
});

interface DonorProviderProps {
  children: React.ReactNode;
}

export const DonorProvider: React.FC<DonorProviderProps> = ({ children }) => {
  const [selectedRequest, setSelectedRequest] =
    useState<Tables<"donation_requests_with_categories_and_tags"> | null>(null);
  const [items, setItems] = useState<Tables<"item">[]>([]);
  const [donation, setDonation] = useState<Tables<"donation">[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);


  useEffect(() => {
    const channel = supabase
      .channel('donation-update-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'donation' },
        async (payload) => {
          const updatedDonation = payload.new;
          const donationId = updatedDonation.id;

          if (updatedDonation.timer_trigger === false) {
            // Invoke the edge function to cancel the timer
            const { error } = await supabase.functions.invoke('failExpiredDonations', {
              method: 'DELETE',
              body: { donation_id: donationId },
            });

            if (error) {
              console.error(`Failed to cancel the timer for donation ${donationId}:`, error);
            } else {
              console.log(`Timer for donation ${donationId} canceled.`);
            }
          }
        }
      )
      .subscribe();

    // Cleanup the subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);







  const createDonation = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!selectedRequest)
      return { success: false, error: "No selected request" };

    try {
      const { data: donorProfile, error: donorError } =
        await supabase.auth.getUser();
      if (donorError || !donorProfile.user)
        throw new Error("Donor not authenticated");

      const { id: donor_ID } = donorProfile.user;
      const { beneficiary_ID, donation_request_id: donationRequest_ID } =
        selectedRequest;

      // 1. Insert into the donation table
      const { data: donationData, error: donationError } = await supabase
        .from("donation")
        .insert([
          {
            donor_ID,
            beneficiary_ID,
            donationRequest_ID,
            status: "PENDING",
            timer_trigger: true, // Optionally set the timer_trigger to true initially

          },
        ])
        .select()
        .single();

      if (donationError || !donationData) {
        console.log(
          donationError,
          "Donation creation failed ....donationError"
        );
        return { success: false, error: "Failed to create donation" };
      } else {
        console.log("Donation created successfully", donationData.id);
      }

      const donation_ID = donationData.id;

      // 2. Insert into donation_items table
      const donationItems = selectedItems.map((item_ID) => ({
        donation_ID,
        item_ID,
      }));

      const { error: donationItemsError } = await supabase
        .from("donation_items")
        .insert(donationItems);

      if (donationItemsError) {
        console.log("Failed to create donationItems", donationItemsError);
        return { success: false, error: "Failed to create donation items" };
      }

      // 3. Update the donationRequest status to "PENDING"
      const { error: donationRequestError } = await supabase
        .from("donationRequest")
        .update({ status: "PENDING" })
        .eq("id", donationRequest_ID);

      if (donationRequestError) {
        console.log(
          "Failed to update donationRequest status",
          donationRequestError
        );
        return {
          success: false,
          error: "Failed to update donation request status",
        };
      }

      // 4. Update the selected items' status to "PENDING"
      const { error: itemStatusError } = await supabase
        .from("item")
        .update({ status: "PENDING" })
        .in("id", selectedItems);

      if (itemStatusError) {
        console.log("Failed to update item status", itemStatusError);
        return { success: false, error: "Failed to update item status" };
      }


         const { error: edgeFunctionError } = await supabase.functions.invoke('failExpiredDonations', {
      method: 'POST',
      body: { donation_id: donation_ID },
    });

    if (edgeFunctionError) {
      console.log("Failed to start timer in edge function", edgeFunctionError);
      return { success: false, error: "Failed to start timer" };
    }
      // Reset selected items after successful donation
      setSelectedItems([]);

      return { success: true };
    } catch (error) {
      console.error("Error in createDonation:", error);
      return { success: false, error: String(error) };
    }
  };

  return (
    <DonationContext.Provider
      value={{
        selectedRequest,
        selectedItems,
        setSelectedItems,
        setSelectedRequest,
        items,
        setItems,
        donation,
        setDonation,
        createDonation, // Added setDonation to the provider value
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
