import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, StyleSheet, FlatList, Button } from "react-native";
import { Tables } from "@/app/database.types";
import { useItemsByDonation } from "@/app/hooks/useDonation";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Item from "@/components/Item";
import { useDonorContext } from "@/app/providers/Donor";
import SlideButton from "@/components/SlideButton";
import Colors from "@/constants/Colors";
import { CustomAlertModal } from "@/components/CustomAlertModal";
import { useIsFocused } from "@react-navigation/native";
import { router, useRouter, useSegments } from "expo-router";

type DonationWithDetails = Tables<"donation_with_details">;
type ItemType = Tables<"item">;

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  donation: DonationWithDetails;
}

const DonationModal: React.FC<DonationModalProps> = ({
  donation,
  visible,
  onClose,
}) => {
  const { data: items, error } = useItemsByDonation(donation.item_ids || []);
  const {
    selectedItems,
    setSelectedItems,
    selectedDonation,
    handleConfirmation,
  } = useDonorContext();
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ['50%', '90%']; // Take up almost the entire screen
    const segments = useSegments(); // Get current route segments



  // Detect if the modal should close when the user navigates away
  

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
    if (segments[0] !== "donations") {
      onClose(); // Automatically close modal when navigating away from "donations"
    }
  }, [visible,segments]);

  console.log(items, "ITEMS");

  const toggleItemSelection = (item: ItemType) => {
    setSelectedItems((prev) => {
      const currentIndex = prev.indexOf(item.id);
      if (currentIndex !== -1) {
        return prev.filter((id) => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const confirm = async () => {
    try {
      setLoading(true);
      setAlertVisible(true); // Show the modal with loading
      setConfirmationMessage("Confirming donation...");
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 0.2;
        setProgress(currentProgress);
        if (currentProgress >= 1) clearInterval(interval);
      }, 400);

      const result = await handleConfirmation();

      if (result.success) {
        setConfirmationMessage("Donation confirmed successfully!");
        setProgress(1);
        setTimeout(() => onClose(), 3000); // Close the modal after 2 seconds
        router.push('/(tabs)')
      } else {
        setConfirmationMessage(`Failed to confirm donation: ${result.error}`);
        setProgress(1);
      }
    } catch (error) {
      setConfirmationMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false); // Close the CustomAlertModal
    setLoading(false); // Reset loading state
  };

  return (
    <BottomSheetModalProvider>
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      style={styles.modal}
      snapPoints={snapPoints}
      onDismiss={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.modalContent}>
          <Text style={styles.title}>Donation Attempt by: </Text>
          <Text style={styles.donorName}>
            {donation.first_name} {donation.last_name}
          </Text>
          <Text style={styles.label}>Headline</Text>
          <Text style={styles.description}>
            {donation.donation_request_headline}
          </Text>
          <Text style={styles.itemsHeader}>Items Selected By Donor:</Text>
  
          {donation.donation_status === "PENDING" ? (
            <FlatList
              data={items}
              pointerEvents="box-none"
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => (
                <Item
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={toggleItemSelection}
                  status={item.status}
                  userRole="beneficiary"
                />
              )}
            />
          ) : (
            // When status is COMPLETE || failed, just show the items with their names
            <FlatList
              data={items}
              showsVerticalScrollIndicator={true}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
              )}
            />
          )}
  
          {donation.donation_status === "PENDING" &&
            selectedItems.length > 0 && (
              <SlideButton
                title="Confirm"
                onSlideComplete={confirm}
                buttonStyle={styles.confirmButton}
              />
            )}
        </View>
      </View>
      <CustomAlertModal
          visible={alertVisible}
          onClose={handleCloseAlert}
          loading={loading}
          message={confirmationMessage}
          progress={progress}
        />
    </BottomSheetModal>
  </BottomSheetModalProvider>
  );
};

export default DonationModal;

const styles = StyleSheet.create({
  modal:{
    //TOP SHADOW 
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 5,

    },
    shadowOpacity: 0.9,

    shadowRadius: 100.00,
    elevation: 5,
  padding : 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",

    alignItems: "center",
  },
  modalContent: {
    height: "90%",
    zIndex: 10,
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 50,
    elevation: 5,
  },
  itemListStyle: {
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontFamily: "Now-Bold",
    marginBottom: 30,
    textAlign: "center",
    alignSelf: "center",
  },
  donorName: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Now-Regular",
    alignSelf: "center",
    color: Colors.theme.primary,
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Now-Bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Now-Light',

  },
  itemsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.grey.alt,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Now-Regular",
  },
  confirmButton: {
    backgroundColor: Colors.green.main,
    borderRadius: 50,
    marginBottom: 20,
    zIndex: 20,
    position: 'absolute',
    bottom: 100,
    alignSelf: "center",
  },
});
