import { StyleSheet, Image, FlatList } from "react-native";
import ToggleSwitch from "@/components/ToggleSwitch";
import RequestCard from "@/components/admin/RequestCard";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers/Auth";
import { useEffect, useState } from "react";
import DonationRequestModal from "../modals/DonationRequestModal";
import Carousel from "react-native-reanimated-carousel";
import RemoteImage from "@/components/RemoteImage";
import FilterChipList from "@/components/FilterChipList";
import {Tables} from '@/app/database.types';
import { useDonationRequestsByBeneficiary, useDonationsByRequest } from "@/app/hooks/useDonation";

type DonationRequest = Tables<'donationRequest'>;
type Donation = Tables<'donation'>;

export default function myDonations() {
  const { data: donationRequests, isLoading: loadingRequests } = useDonationRequestsByBeneficiary();
  const requestIds = donationRequests?.map(request => request.id) || [];
  const { data: donations, isLoading: loadingDonations } = useDonationsByRequest(requestIds);

  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const { profile } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleManage = (request: DonationRequest) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!donationRequests) return; // If no data, return early

    console.log("Donation Requests: ", donationRequests);
    console.log("Donations: ", donations);

    let filtered = donationRequests;

    if (selectedFilter !== 'All') {
      filtered = donationRequests.filter(request => {
        const matchingDonations = donations?.filter(donation => donation.donationRequest_ID === request.id);
        const matchingDonationStatuses = matchingDonations?.some(donation => donation.status === selectedFilter);
        return request.status === selectedFilter || matchingDonationStatuses;
      });
    }

    // Update the filteredRequests state
    setFilteredRequests(filtered);
  }, [selectedFilter, donationRequests, donations]);

  // Han
  
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const renderItem = ({ item }: { item: DonationRequest }) => {
    const associatedDonations = donations?.filter((donation) => donation.donationRequest_ID === item.id);

    return (
      <RequestCard
        headline={item.headline}
        location={item.formatted_address}
        status={item.status}
        description={item.description}
        items={associatedDonations?.length || 0}
        image={item.images?.[0] || ''}
        onManage={() => handleManage(item)}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>My Requests</Text>
          <Image
            source={require("../../../assets/images/birdbox.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterChipList onFilterChange={handleFilterChange} />
        </View>
      </View>
      <View>
        {/* <FlatList
          data={filteredRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        /> */}
          <FlatList
          data={filteredRequests} // Now using filteredRequests instead of donationRequests
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        {selectedRequest && (
          <DonationRequestModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            description={selectedRequest.description}
            items={[]} // If you want to pass associated items, fetch them from elsewhere
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
});
