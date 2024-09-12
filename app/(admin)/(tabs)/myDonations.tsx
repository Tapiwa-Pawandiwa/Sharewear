import { StyleSheet, Image, FlatList, Dimensions, Text, View, TouchableOpacity } from "react-native";
import ToggleSwitch from "@/components/ToggleSwitch";
import RequestCard from "@/components/admin/RequestCard";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers/Auth";
import { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import DonationModal from "../modals/DonationModal";
import RemoteImage from "@/components/RemoteImage";
import FilterChipList from "@/components/FilterChipList";
import { Tables } from "@/app/database.types";
import {
  useDonationByBeneficiary,
  useDonationRequestsByBeneficiary,
  useDonationsByRequest,
} from "@/app/hooks/useDonation";
import DonationCard from "@/components/user/DonationCard";
import { useDonorContext } from "@/app/providers/Donor";

type DonationRequest = Tables<"donationRequest">;
type DonationWithDetails = Tables<"donation_with_details">;

export default function myDonations() {
  const windowHeight = Dimensions.get("window").height;

  const { data: donations, isLoading: loadingDonations, refetch } =
    useDonationByBeneficiary();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const { setSelectedDonation, selectedDonation } = useDonorContext(); // Get setSelectedDonation from context

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const channel = supabase.channel('donation-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donation_with_details' },
        (payload) => {
          console.log('Change received!', payload);
          refetch(); // Refetch data whenever a change is received
        }
      )
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);


  const handleManage = (donation: DonationWithDetails) => {
    setSelectedDonation(donation);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };
  
  const filteredDonations = (
    donations?.filter((donation) => {
      if (selectedFilter === "All") return true;
      return donation.donation_status === selectedFilter.toUpperCase(); // Ensure status matches filter
    }) || []
  ).sort((a, b) => {
    const dateA = a.time_added ? new Date(a.time_added).getTime() : 0; // Handle null by assigning 0
    const dateB = b.time_added ? new Date(b.time_added).getTime() : 0;
    return dateB - dateA; // Sort in descending order
  });

  const renderItem = ({ item }: { item: DonationWithDetails }) => {
    return (
      <TouchableOpacity onPress={() => handleManage(item)} >
        <DonationCard
          donation={item}
          type="requester"
          onManage={() => handleManage(item)}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Donations </Text>
          <Image
            source={require("../../../assets/images/birdbox.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterChipList onFilterChange={handleFilterChange} type="donation" />
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={filteredDonations}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingBottom:100}}
          showsVerticalScrollIndicator={true}
        />
        
      </View>
      {selectedDonation && (
          <DonationModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            donation={selectedDonation} // Use selectedDonation from context
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  title: {
    fontSize: 30,
    marginLeft: 10,
    fontFamily: "Now-Bold",
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 80,
    marginTop: -20,
  },
  headerContainer: {
    height: 140,
    borderRadius: 40,
    width: "95%",
    marginTop: 35,
    marginLeft: 10,
    marginBottom: 20,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
    marginTop: 50,
    width: "95%",
    marginLeft: 10,
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  results: {
    marginTop: 25,
  },

  listContainer: {
    flex: 1,
    height: '100%',
  },
});
