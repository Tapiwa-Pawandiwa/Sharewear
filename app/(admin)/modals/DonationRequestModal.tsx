import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, Button } from 'react-native';
import { Tables } from '@/app/database.types';

type DonationRequest = Tables<'donation_requests_with_categories_and_tags'>;

interface DonationRequestModalProps {
  visible: boolean;
  onClose: () => void;
  donationRequest: DonationRequest;}

const DonationRequestModal: React.FC<DonationRequestModalProps> = ({ visible, onClose, donationRequest}) => {
  
  
  
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          <Text style={styles.title}>Manage Request</Text>
         <Text>Description</Text>
          <Text style={styles.description}>{donationRequest.description}</Text>
          <Text style={styles.itemsHeader}>Items:</Text>
          <FlatList
            data={donationRequest.item_names}
            keyExtractor={(donationRequest) => donationRequest}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text>{item}</Text>
              </View>
            )}
          />

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default DonationRequestModal;

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
    marginTop: 50,
    padding: 20,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
