import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDonationsByDonor, useDonationWithDetails } from "@/app/hooks/useDonation";
import { Tables } from "@/app/database.types";
import DonationCard from "./DonationCard";
import CategoryChip from "./CategoryChip";
import FilterChip from "../FilterChip";

type DonationWithDetails = Tables<"donation_with_details">;

const DonationList: React.FC = () => {
  const { data: donationsWithDetails, isLoading } = useDonationsByDonor();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filterDonations = (donations: DonationWithDetails[]) => {
    if (selectedStatus === "ALL") {
      return donations;
    }
    return donations.filter(
      (donation) => donation.donation_status === selectedStatus
    );
  };

  if (isLoading || !donationsWithDetails) {
    return <Text>Loading...</Text>; // Handle loading state
  }

  const filteredDonations = filterDonations(donationsWithDetails);

  const statusCategories = [
    { id: "ALL", name: "All" },
    { id: "PENDING", name: "Pending" },
    { id: "FAILED", name: "Failed" },
    { id: "COMPLETE", name: "Complete" },
  ];
  return (
    <View>
      <View style={styles.chipsContainer}>
      {statusCategories.map((category) => (
          <FilterChip
            key={category.id}
            name={category.name}
            isSelected={selectedStatus === category.id}
            onPress={(name) => {
              // Map the name to the corresponding status ID
              const status = statusCategories.find((cat) => cat.name === name)?.id || "ALL";
              setSelectedStatus(status);
            }}
          />
        ))}
      </View>
      <FlatList
    data={filteredDonations} // Display only filtered donations
    renderItem={({ item }) => {
      return <DonationCard donation={item} />;
    }}
        keyExtractor={(item: DonationWithDetails) =>
          item.donation_id?.toString() || "fallback-key"
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default DonationList;

const styles = StyleSheet.create({
  flatListContainer: {},
  chipsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
