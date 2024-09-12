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

type DonationWithDetails = Tables<"donation_with_details">;

const DonationList: React.FC = () => {
  const windowHeight = Dimensions.get("window").height;
  const { data: donations, isLoading, refetch } = useDonationsByDonor();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  useEffect(() => {
    const channel = supabase
      .channel("donation-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donation_with_details" },
        (payload) => {
          console.log("Change received!", payload);
          refetch(); // Refetch data whenever a change is received
        }
      )
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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
          return <DonationCard donation={item} type="donor" />;
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
