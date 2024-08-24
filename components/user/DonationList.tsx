import React, { useEffect } from 'react';
import { View, Text , FlatList,StyleSheet} from 'react-native';
import DonationCard from './DonationCard';
import { useDonationRequests } from '@/app/hooks/useDonationRequests';
9



const DonationList = () => {
  const { data: donationRequests, isLoading } = useDonationRequests();



  if (isLoading) {
    return <Text>Loading...</Text>; // Add a loading indicator or message
  }

  return (
    <View>
      <FlatList
        data={donationRequests}
        renderItem={({ item }) => <DonationCard donationRequest={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default DonationList;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 10, // Add padding to the start and end of the FlatList
  },
});