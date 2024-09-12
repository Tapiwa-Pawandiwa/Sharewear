import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, Button, Dimensions } from 'react-native';
import { Tables } from '@/app/database.types';
import { useItemsByDonationRequest } from '@/app/hooks/useDonation';
import Colors from '@/constants/Colors';
import Badge from '@/components/Badge';
import { BottomSheetModal ,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import { useSegments } from 'expo-router';

type DonationRequest = Tables<'donation_requests_with_categories_and_tags'>;

interface DonationRequestModalProps {
  visible: boolean;
  onClose: () => void;
  donationRequest: DonationRequest;}

const DonationRequestModal: React.FC<DonationRequestModalProps> = ({ visible, onClose, donationRequest}) => {
  const windowHeight = Dimensions.get("window").height;

  const { data: items, isLoading } = useItemsByDonationRequest(donationRequest.donation_request_id || 0);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ['50%', '90%']; // Take up almost the entire screen
  const segments = useSegments(); // Get current route segments



  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }

    // Detect route changes, and close modal if we're not on the "donations" route
    if (segments[0] !== "donations") {
      onClose(); // Automatically close modal when navigating away from "donations"
    }
  }, [visible, segments]);

  const renderItem = ({ item }: { item: Tables<'item'> }) => {
    const isComplete = item.status === 'COMPLETE';

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        {isComplete ? <Badge text="Donated" /> : <Text ></Text>}
      </View>
    );
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Manage Request</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{donationRequest.description}</Text>
          <Text style={styles.itemsHeader}>Items:</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ height: windowHeight + 100 }}
            snapToInterval={windowHeight+100}
            
          />
        </View>
      </View>
    </BottomSheetModal>
  </BottomSheetModalProvider>
 );
};

export default DonationRequestModal;

const styles = StyleSheet.create({
  modal:{
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
    justifyContent: 'center',

    alignItems: 'center',
    
  },

  modalContent: {
    height : '90%',

    padding: 20,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Now-Bold',
    marginBottom: 30,
    textAlign: 'center',
    alignSelf: 'center',
  },
  label:{
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Now-Bold',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Now-Light',
    marginBottom: 20,
  },
  itemsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.grey.alt,
    padding: 10,
    height: 50,
    verticalAlign: 'middle',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Now-Light',

  },
});
