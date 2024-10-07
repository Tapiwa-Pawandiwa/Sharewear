import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, ScrollView } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import RemoteImage from "@/components/RemoteImage";
import { useQuery } from "react-query";
import { Tables } from "@/app/database.types";
import { useDonationRequestsWithCategory } from "@/app/hooks/useDonation";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import BackButton from "@/components/BackButton";
import { useItems } from "@/app/hooks/useDonation";
import SlideButton from "@/components/SlideButton";
import { useDonorContext } from "@/app/providers/Donor";
import { CustomAlertModal } from "@/components/CustomAlertModal";
import Item from "@/components/Item";

type ItemType = Tables<"item">;

export default function donationRequest() {
  const router = useRouter();
  const {
    selectedRequest,
    setSelectedRequest,
    selectedItems,
    setSelectedItems,
    createDonation,
  } = useDonorContext(); // Use DonorContext
  const { id } = useLocalSearchParams(); // Retrieve the 'id' from the route parameters
  const { data: items } = useItems();
  const [loading, setLoading] = useState(true); // Loading state
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]); // Ensure filteredItems is always an array with correct type
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const [progress, setProgress] = useState(0); // Progress state

  const {
    data: donationRequests,
    isLoading,
    refetch,
  } = useDonationRequestsWithCategory(); // Use your custom hook
  const donationRequest = donationRequests?.find(
    (request) => request.donation_request_id?.toString() === id?.toString()
  );

  if (!donationRequest) {
    return <Text>No donation request found.</Text>; // Handle case when no donation request is found
  }

  useEffect(() => {
    if (donationRequest && items) {
      const filtered = items.filter(
        (item) =>
          item.donationRequest_ID === donationRequest.donation_request_id
      ) as ItemType[];
      setFilteredItems(filtered);
      setSelectedRequest(donationRequest); // Set selected request in context
    }
  }, [donationRequest, items]);

  const renderImageItem = ({ item }: { item: string }) => {
    return (
      <RemoteImage
        path={item}
        style={styles.carouselImage}
        fallback="https://via.placeholder.com/150"
      />
    );
  };

  const toggleItemSelection = (item: ItemType) => {
    setSelectedItems((prevItems: number[]) => {
      if (prevItems.includes(item.id)) {
        return prevItems.filter((i) => i !== item.id);
      } else {
        return [...prevItems, item.id];
      }
    });
  };

  const handleDonation = async () => {
    console.log("Starting handleDonation, selectedItems:", selectedItems);
    setIsUploading(true);
    setModalVisible(true);
    try {
      const { success, error } = await createDonation();
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 0.2;
        setProgress(currentProgress);
        if (currentProgress >= 1) clearInterval(interval);
      }, 400);
      if (success) {
        console.log("Donation created successfully");
        router.push("/(user)");
      }
    } catch (error) {
      console.error("Error posting form data:", error);
    } finally {
      setIsUploading(false);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.carouselContainer}>
        {donationRequest.images && (
          <Carousel<string> // Explicitly define the type as string
            data={donationRequest.images || []} // Pass the images array
            renderItem={({ item }) => (
              <Image
                source={item}
                style={styles.carouselImage}
                contentFit="cover"
                placeholder={{ uri: "https://via.placeholder.com/150" }}
                cachePolicy="memory-disk"
              />
            )}
            width={370}
            height={200}
            loop
            style={styles.carouselImage}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headline}>{donationRequest.headline}</Text>
        <Text style={styles.formattedAddress}>
          {donationRequest.formatted_address}
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <Text style={styles.description}>{donationRequest.description}</Text>
        </ScrollView>
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.itemsNeeded}>Items Needed</Text>
        <Text style={styles.quanityLabel}>Quantity</Text>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <Item
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelect={toggleItemSelection}
            status={item.status}
            userRole="donor"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingBottom: filteredItems.length * 2 + 200,
        }}
      />
      {selectedItems.length > 0 && (
        <View style={styles.popupContainer}>
          <View style={styles.innerPopup}>
            <Text style={styles.slideText}>Slide to Commit to donation</Text>
            <Text style={styles.slideSub}>24 hours to drop off donation</Text>
          </View>

          <SlideButton
            title="Donate"
            onSlideComplete={handleDonation}
            buttonStyle={styles.commitButton}
          />
        </View>
      )}
      {isUploading && (
        <CustomAlertModal
          visible={modalVisible}
          progress={progress}
          loading={isUploading}
          message="Processing Commitment..."
          onClose={() => setModalVisible(false)} // Pass the progress value to the modal
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  carouselContainer: {
    marginTop: 20,
    width: 370,
    borderRadius: 25,
    height: 200,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    marginHorizontal: 12,
  },
  innerPopup: {
    marginTop: 10,
  },
  carouselImage: {
    width: 370,
    height: 200,
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 25,
    marginBottom: 10,
  },
  commitButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  popupContainer: {
    alignSelf: "center",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "white",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  textContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  headline: {
    fontSize: 16,
    fontWeight: "bold",
  },
  formattedAddress: {
    fontSize: 14,
    fontWeight: "300",
    marginVertical: 4,
  },
  descriptionContainer: {
    marginBottom: 20,
    height: 150,
    borderRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  slideText: {
    fontFamily: "Now-Regular",
    fontSize: 16,
    alignSelf: "center",
  },
  slideSub: {
    fontFamily: "Now-Light",
    fontSize: 14,
    alignSelf: "center",
    color: Colors.theme.secondContrast,
  },
  description: {
    color: "black",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Now-Light",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  quanityLabel: {
    justifyContent: "flex-end",
    fontSize: 16,
    marginRight: 10,
    fontFamily: "Now-Bold",
    marginBottom: 10,
  },
  itemsNeeded: {
    fontSize: 16,
    marginLeft: 20,
    fontFamily: "Now-Bold",
    marginBottom: 10,
  },
});
