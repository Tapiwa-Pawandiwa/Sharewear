import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import {
  useDonationsByDonor,
  useDonationWithDetails,
} from "@/app/hooks/useDonation";
import { Tables } from "@/app/database.types";
import DonationCard from "./DonationCard";
import CategoryChip from "./CategoryChip";
import FilterChip from "../FilterChip";
import { supabase } from "@/lib/supabase";
import * as Progress from 'react-native-progress'
import Colors from "@/constants/Colors";
import { ActivityIndicator } from "react-native-paper";
import { useDonorContext } from "@/app/providers/Donor";
import { CustomAlertModal } from "../CustomAlertModal";

type DonationWithDetails = Tables<"donation_with_details">;

const DonationList: React.FC = () => {
  const windowHeight = Dimensions.get("window").height;
  const { data: donations, isLoading, refetch } = useDonationsByDonor();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [donationUpdates, setDonationUpdates] = useState<Record<number, any>>({});
  const {cancelDonation,setSelectedDonation} = useDonorContext();
  // Subscribe to donation and timer changes and update state accordingly
  useEffect(() => {
    const donationChannel = supabase.channel("donation-updates")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "donation_with_details" },
      (payload) => {
       
       
        if (payload.new && (payload.new as DonationWithDetails).donation_id) {
          const updatedDonation = payload.new as DonationWithDetails;
          setDonationUpdates((prev) => ({
            ...prev,
            [updatedDonation.donation_id!]: {
              ...prev[updatedDonation.donation_id!],
              status: updatedDonation.donation_status,
            },
          }));
        }
      }
    )
    .subscribe();

    const timerChannel = supabase.channel("donation-timer-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donation_timers" },
        (payload) => {
          if (payload.new && (payload.new as DonationWithDetails).donation_id) {
            const updatedTimer = payload.new as DonationWithDetails;
            setDonationUpdates((prev) => ({
              ...prev,
              [updatedTimer.donation_id!]: {
                ...prev[updatedTimer.donation_id!],
                timerCanceled: updatedTimer.timer_canceled ?? false,
              },
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(donationChannel);
      supabase.removeChannel(timerChannel);
    };
  }, []);

  const filterAndSortDonations = (donations: DonationWithDetails[]) => {
    const filtered =
      selectedStatus === "ALL"
        ? donations
        : donations.filter(
            (donation) => donation.donation_status === selectedStatus
          );

    // Sort donations by `time_added`, assuming it exists and is in a valid date format
    return filtered.sort((a, b) => {
      const dateA = a.time_added ? new Date(a.time_added).getTime() : 0;
      const dateB = b.time_added ? new Date(b.time_added).getTime() : 0;
      return dateB - dateA; // Sort in descending order (latest first)
    });
  };

  if (isLoading || !donations) {
    return (
      <View>
        <ActivityIndicator 
          color={Colors.theme.primary}
          size={100}
        />
      </View>
    )
    ; // Handle loading state
  }

  const filteredDonations = filterAndSortDonations(donations);

  const statusCategories = [
    { id: "ALL", name: "All" },
    { id: "PENDING", name: "Pending" },
    { id: "FAILED", name: "Failed" },
    { id: "COMPLETE", name: "Complete" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        {statusCategories.map((category) => (
          <FilterChip
            key={category.id}
            name={category.name}
            isSelected={selectedStatus === category.id}
            onPress={(name) => {
              // Map the name to the corresponding status ID
              const status =
                statusCategories.find((cat) => cat.name === name)?.id || "ALL";
              setSelectedStatus(status);
            }}
          />
        ))}
      </View>

      <FlatList
        data={filteredDonations} // Display only filtered donations
        renderItem={({ item }) => {
          const update = donationUpdates[item.donation_id!] || {}; // Ensure donation_id is available
 
          const handleCancelDonation = async (donation: DonationWithDetails) => {
            await cancelDonation(donation);
          };

          return <DonationCard donation={item} type="donor"  donationStatus={update.status || item.donation_status}
              timerCanceled={update.timerCanceled ?? item.timer_canceled}                       onCancelDonation={() => handleCancelDonation(item)} // Pass the bound cancel function
              // Pass the bound cancel function
              />;
        }}
        keyExtractor={(item) => `${item.donation_id}-${item.donation_id}`}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{paddingBottom:100}}
      />
    </View>
  );
};

export default DonationList;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 10,
  },
  flatListContainer: {},
  chipsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  listStyle:{
  }
});
