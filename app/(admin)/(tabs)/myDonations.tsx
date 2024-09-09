import { StyleSheet, Image, FlatList, Dimensions } from "react-native";
import ToggleSwitch from "@/components/ToggleSwitch";
import RequestCard from "@/components/admin/RequestCard";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers/Auth";
import { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import DonationModal from "../modals/DonationModal";
import RemoteImage from "@/components/RemoteImage";
import FilterChipList from "@/components/FilterChipList";
import {Tables} from '@/app/database.types';
import { useDonationByBeneficiary, useDonationRequestsByBeneficiary, useDonationsByRequest } from "@/app/hooks/useDonation";
import DonationCard from "@/components/user/DonationCard";
import { useDonorContext } from "@/app/providers/Donor";

type DonationRequest = Tables<'donationRequest'>;
type DonationWithDetails = Tables<'donation_with_details'>;

export default function myDonations() {
  const windowHeight = Dimensions.get('window').height;

  const { data: donations, isLoading: loadingDonations } = useDonationByBeneficiary();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const { setSelectedDonation, selectedDonation } = useDonorContext(); // Get setSelectedDonation from context

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const filteredDonations = donations?.filter((donation) => {
    if (selectedFilter === "All") return true;
    return donation.donation_status === selectedFilter.toUpperCase(); // Ensure status matches filter
  }) || [];

  const renderItem = ({ item }: { item: DonationWithDetails }) => {
    return <DonationCard donation={item} type="requester" onManage={()=>handleManage(item)} />;
  };
  
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
          <FilterChipList onFilterChange={handleFilterChange} type="donation"/>
        </View>
      </View>
      <View style={styles.listContainer}>
          <FlatList
        data={filteredDonations}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ height: windowHeight,paddingBottom: 20 }}
        showsVerticalScrollIndicator={true}
        snapToInterval={windowHeight}

      />  
         {selectedDonation && (
        <DonationModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          donation={selectedDonation} // Use selectedDonation from context
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  
  listContainer:{
flex: 1,
  }
});
