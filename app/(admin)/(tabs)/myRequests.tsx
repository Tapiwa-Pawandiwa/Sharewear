import { StyleSheet, Image, FlatList } from "react-native";
import ToggleSwitch from "@/components/ToggleSwitch";
import RequestCard from "@/components/admin/RequestCard";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers/Auth";
import { useEffect, useState } from "react";
import { useDonationRequestsWithCategoryAndTagsByProfile } from "@/app/hooks/useDonation";
import Carousel from "react-native-reanimated-carousel";
import RemoteImage from "@/components/RemoteImage";
import FilterChipList from "@/components/FilterChipList";

interface DataItem {
  id: string;
  headline: string;
  formatted_address: string;
  items: number;
  from: string;
  image: string;
  time: string;
  category_names: string[]; // Add categories to DataItem
}

interface DonationRequest {
  id: string;
  headline: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
  main_location: string;
  secondary_location: string;
  images: string[]; // Array of image URLs
  category_id?: string; // Assuming category_id might be optional
  category_name?: string; // Optional if using with category data
  tag_names?: string[]; // Optional if using with tags data
  item_names?: string[]; // Optional if using with item data
}

export default function TabTwoScreen() {
  const {
    data: donationRequestsWithCategoryAndTags,
    error,
    isLoading,
  } = useDonationRequestsWithCategoryAndTagsByProfile();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');


  const { profile } = useAuth();

  useEffect(() => {
    if (donationRequestsWithCategoryAndTags) {
      let filtered = donationRequestsWithCategoryAndTags;

      if (selectedFilter === 'Available') {
        filtered = donationRequestsWithCategoryAndTags.filter(request => request.status === 'AVAILABLE');
      } else if (selectedFilter === 'Pending') {
        filtered = donationRequestsWithCategoryAndTags.filter(request => request.status === 'PENDING');
      } else if (selectedFilter === 'Complete') {
        filtered = donationRequestsWithCategoryAndTags.filter(request => request.status === 'COMPLETE');
      } else if (selectedFilter === 'All') {
        filtered = donationRequestsWithCategoryAndTags;
      }

      const transformedData: DataItem[] = filtered.map(request => ({
        id: request.donation_request_id?.toString() ?? 'fallback-id',
        headline: request.headline || 'No headline available',
        formatted_address: request.formatted_address || 'No address available',
        items: request.item_names?.length || 0,
        image: request.images?.[0] || 'https://via.placeholder.com/200',
        from: '',
        time: new Date().toLocaleTimeString(),
        category_names: request.category_names || [],
      }));

      setFilteredData(transformedData);
    }
  }, [donationRequestsWithCategoryAndTags, selectedFilter]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };


  const renderItem = ({ item }: { item: DataItem }) => (
    <RequestCard
      description={item.headline}
      location={item.formatted_address}
      items={item.items}
      from={item.from}
      image={item.image}
      time={item.time}
    />
  );

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
          <FilterChipList onFilterChange={handleFilterChange}/>
        </View>
      </View>
      <View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
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
