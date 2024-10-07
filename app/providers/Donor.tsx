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
  selectedDonation: Tables<"donation_with_details"> | null; // Set the selected donation
  setSelectedDonation: React.Dispatch<React.SetStateAction<Tables<"donation_with_details"> | null>>; // Add setter
  createDonation: () => Promise<{ success: boolean; error?: string }>;
  handleConfirmation : () => Promise<{ success: boolean; error?: string }>; // Added
  cancelDonation: (donation: Tables<"donation_with_details">) => Promise<void>; // Updated type
}

const DonationContext = createContext<RequestContextType>({
  selectedRequest: null,
  setSelectedRequest: () => {},
  items: [],
  selectedDonation: null, // Default to null
  setSelectedDonation: () => {}, // Added
  setItems: () => {},
  selectedItems: [], // Added selectedItems
  setSelectedItems: () => {}, // Added
  donation: [],
  setDonation: () => {},
  createDonation: async () => ({ success: false }),
  handleConfirmation: async () => ({ success: false }), // Added
  cancelDonation: async () => {}, // Added
});

interface DonorProviderProps {
  children: React.ReactNode;
}

export const DonorProvider: React.FC<DonorProviderProps> = ({ children }) => {
  const [selectedRequest, setSelectedRequest] = useState<Tables<"donation_requests_with_categories_and_tags"> | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Tables<"donation_with_details"> | null>(null); // Track selected donation
  const [items, setItems] = useState<Tables<"item">[]>([]);
  const [donation, setDonation] = useState<Tables<"donation">[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  useEffect(() => {
    const channel = supabase
      .channel("donation-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "donation" },
        async (payload) => {
          const updatedDonation = payload.new;
          const donationId = updatedDonation.id;
          
          if (updatedDonation.timer_trigger === false) {
            // Invoke the edge function to cancel the timer
            const { error } = await supabase.functions.invoke(
              "failExpiredDonations",
              {
                method: "DELETE",
                body: { donation_id: donationId },
              }
            );

            if (error) {
              console.error(
                `Failed to cancel the timer for donation ${donationId}:`,
                error
              );
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

      const { error: edgeFunctionError } = await supabase.functions.invoke(
        "failExpiredDonations",
        {
          method: "POST",
          body: { donation_id: donation_ID },
        }
      );

      if (edgeFunctionError) {
        console.log(
          "Failed to start timer in edge function",
          edgeFunctionError
        );
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

  const handleConfirmation = async () => {
    try {
      
      if (!selectedDonation) {
        throw new Error("No selected request or donation");
      }

      const confirmedItems = selectedItems;
      const unconfirmedItems = items.filter(
        (item) => !confirmedItems.includes(item.id)
      ); // Items not confirmed

      // 1. Update the status of confirmed items to 'COMPLETE'
      const { error: confirmError } = await supabase
        .from("item")
        .update({ status: "COMPLETE" })
        .in("id", confirmedItems);

      if (confirmError) {
        console.error(
          "Failed to update confirmed items to 'COMPLETE'",
          confirmError
        );
        return { success: false, error: confirmError.message };
      }

      // 2. Update the status of unconfirmed items to 'AVAILABLE' if needed
      if (unconfirmedItems.length > 0) {
        const { error: unconfirmError } = await supabase
          .from("item")
          .update({ status: "AVAILABLE" })
          .in(
            "id",
            unconfirmedItems.map((item) => item.id)
          );

        if (unconfirmError) {
          console.error(
            "Failed to update unconfirmed items to 'AVAILABLE'",
            unconfirmError
          );
          return { success: false, error: unconfirmError.message };
        }
      }

      // 3. Check the status of all items in the donation request to update the donationRequest status
      const { data: allItems, error: fetchError } = await supabase
        .from("item")
        .select("*")
        .eq("donationRequest_ID", selectedDonation.donationRequest_ID);

      if (fetchError) {
        console.error("Failed to fetch all items", fetchError);
        return { success: false, error: fetchError.message };
      }

      const allComplete = allItems.every((item) => item.status === "COMPLETE");
      const anyPending = allItems.some((item) => item.status === "PENDING");

      // 4. Update the donationRequest status based on the items' statuses
      let donationRequestStatus = "AVAILABLE";
      if (allComplete) {
        donationRequestStatus = "COMPLETE";
      } else if (anyPending || confirmedItems.length > 0) {
        donationRequestStatus = "PENDING";
      }
      const { error: requestUpdateError } = await supabase
        .from("donationRequest")
        .update({ status: donationRequestStatus })
        .eq("id", selectedDonation.donationRequest_ID);

      if (requestUpdateError) {
        console.error(
          "Failed to update donationRequest status",
          requestUpdateError
        );
        return { success: false, error: requestUpdateError.message };
      }
      // 5. If any items were confirmed as COMPLETE, update the donation status to 'COMPLETE'
      if (confirmedItems.length > 0) {

        const { error: donationUpdateError } = await supabase
          .from("donation")
          .update({ status: "COMPLETE" })
          .eq("id", selectedDonation.donation_id); // Assuming you're working with one donation at a time

        if (donationUpdateError) {
          console.error(
            "Failed to update donation status to 'COMPLETE'",
            donationUpdateError
          );
          return { success: false, error: donationUpdateError.message };
        }

        
        if (confirmedItems.length > 0) {
          const { error: donationUpdateError } = await supabase
              .from("donation")
              .update({ status: "COMPLETE", timer_trigger: false })
              .eq("id", selectedDonation.donation_id);
      
          if (donationUpdateError) {
              console.error("Failed to update donation status to 'COMPLETE'", donationUpdateError);
              return { success: false, error: donationUpdateError.message };
          }
      
          // Invoke the edge function to cancel the timer
          const { error: timerCancelError } = await supabase.functions.invoke(
              "failExpiredDonations",
              {
                  method: "DELETE",
                  body: { donation_id: selectedDonation.donation_id },
              }
          );
      
          if (timerCancelError) {
              console.error("Failed to cancel the timer in edge function", timerCancelError);
          }
      }

      }
      setSelectedItems([]);
      console.log("Donation confirmation successful");
      return { success: true };
    } catch (error) {
      console.error("Error handling confirmation:", error);
      return { success: false, error: String(error) };

    }
  };

 const cancelDonation = async (donation: Tables<"donation_with_details">)=>{
  if (!donation) {
    console.error("No donation provided");
    return;
  }
  try {
    console.log('Cancelling donation with ID:', donation.donation_id);

    // Assuming the donation object contains the donation id and details
//the donaiton isnt updating as required - it is not 
    // Step 1: Update the donation timer to mark it as canceled
    const { error: timerCancelError } = await supabase.functions.invoke(
      "failExpiredDonations",
      {
          method: "DELETE",
          body: { donation_id: donation.donation_id },
      }
  );

    // Step 2: Update the donation status to "FAILED" or any other relevant status
    const { error: donationError } = await supabase
      .from("donation")
      .update({ status: "FAILED" , timer_trigger: false }) // Assuming "FAILED" represents a canceled donation
      .eq("id", donation.donation_id);

    if (donationError) {
      console.error("Error updating donation status:", donationError);
      return;
    }

   // step 3: Update the donation items status to "AVAILABLE"
   const { error: itemError } = await supabase
   .from("item")
   .update({ status: "AVAILABLE"})
   .eq("donationRequest_ID", donation.donationRequest_ID);

   if(itemError){
      console.error("Error updating item status during cancellation:", itemError);
      return;
   

   }



    console.log("Donation canceled successfully");
  } catch (err) {
    console.error("Unexpected error during cancellation:", err);
  }


 }

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
        createDonation,
        cancelDonation,
        setSelectedDonation,
        selectedDonation,
        handleConfirmation// Added setDonation to the provider value
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
