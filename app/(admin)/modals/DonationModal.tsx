import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, Button } from 'react-native';
import { Tables } from '@/app/database.types';
import { useItemsByDonation } from '@/app/hooks/useDonation';
import Item from '@/components/Item';
import { useDonorContext } from '@/app/providers/Donor';
import SlideButton from '@/components/SlideButton';
import Colors from '@/constants/Colors';

type DonationWithDetails = Tables<'donation_with_details'>;
type ItemType = Tables<'item'>;

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  donation: DonationWithDetails;}
  //dont use this - fetch donations from the database or fix the view so you dont have seperate entries for donations 
  // so for each donation - for the items   it must aggregate the items into an array 

const DonationModal: React.FC<DonationModalProps> = ({ donation,visible,onClose }) => {
  const { data: items, error } = useItemsByDonation(donation.item_ids || []);
  const {selectedItems, setSelectedItems, selectedDonation, handleConfirmation} = useDonorContext();


  const toggleItemSelection = (item: Item) => {
    setSelectedItems((prev) => {
      const currentIndex = prev.indexOf(item.id);
      if (currentIndex !== -1) {
        return prev.filter((id) => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}  pointerEvents="box-none">
        <View style={styles.modalContent}>
          <Text style={styles.title}>Donation Attempt</Text>
          <Text style={styles.donorName}>{donation.first_name} {donation.last_name}</Text>
         <Text>Description</Text>
          <Text style={styles.description}>{donation.donation_request_headline}</Text>
          <Text style={styles.itemsHeader}>Items:</Text>
          <FlatList
            data={items}
            pointerEvents="box-none"  // Allow touch events to pass through

            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <Item
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={toggleItemSelection}
                status={item.status}
                userRole='beneficiary'
              />
            )}
          />
          <SlideButton title="Confirm" onSlideComplete={()=>handleConfirmation()} buttonStyle={styles.confirmButton}/>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
    );
};

export default DonationModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    height : '90%',
    zIndex: 10, 
    marginTop: 50,
    padding: 20,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
  },
  itemListStyle:{
    flexDirection: 'row',

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
    donorName: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        alignSelf: 'center',
        },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  itemsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',

    marginBottom: 10,
  },
  itemText:{
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButton:{
    backgroundColor:  Colors.green.main,
    borderRadius: 50,
    marginTop: 20,
    zIndex: 20,  
    alignSelf: 'center',
  }
});
