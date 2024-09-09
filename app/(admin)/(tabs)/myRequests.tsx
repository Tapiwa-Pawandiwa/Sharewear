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

type DonationRequest = Tables<'donation_requests_with_categories_and_tags'>;

export default function TabTwoScreen() {
  const { data: donationRequests, isLoading: loadingRequests } = useDonationRequestsByBeneficiary();
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
    const filtered = donationRequests?.filter(request => {
        if (selectedFilter === "All") return true;
        return request.status?.toUpperCase() === selectedFilter.toUpperCase(); // Check status against the filter
    });

    setFilteredRequests(filtered || []);
}, [selectedFilter, donationRequests]);
  
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const renderItem = ({ item }: { item: DonationRequest }) => {
    return (
      <RequestCard
         donationRequest={item}
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
      <View  style={styles.listContainer}>
         <FlatList
          data={filteredRequests} // Now using filteredRequests instead of donationRequests
          renderItem={renderItem}
          keyExtractor={(item, index) => item.donation_request_id ? item.donation_request_id.toString() : `unidentified-${index}`}
        />
        {selectedRequest && (
          <DonationRequestModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            donationRequest={selectedRequest} // Pass the selected request correctly
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
