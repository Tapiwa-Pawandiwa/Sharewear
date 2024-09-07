import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, Button } from 'react-native';

interface Item {
  id: number;
  name: string;
  quantity: number;
}

interface DonationRequestModalProps {
  visible: boolean;
  onClose: () => void;
  description: string;
  items: Item[];
}

const DonationRequestModal: React.FC<DonationRequestModalProps> = ({ visible, onClose, description, items }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          
          <Text style={styles.title}>Manage Request</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.itemsHeader}>Items:</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text>{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
