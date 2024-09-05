import React from 'react'
import { View, Text , FlatList, StyleSheet} from 'react-native';
import { useDonationWithDetails } from '@/app/hooks/useDonation';
import { Tables } from '@/app/database.types';
import DonationCard from './DonationCard';





type DonationWithDetails = Tables<'donation_with_details'>;

const DonationList:React.FC=() =>{
    const { data: donationsWithDetails, isLoading } = useDonationWithDetails();

    if (isLoading || !donationsWithDetails) {
      return <Text>Loading...</Text>; // Handle loading state
    }
  return (
    <View>
    <FlatList
    
      data={donationsWithDetails}
      renderItem={({ item }) => {
        return <DonationCard donation={item} />;
      }}
      keyExtractor={(item: DonationWithDetails) => item.donation_id?.toString() || 'fallback-key'}
      
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
    />
  </View>
);
}

export default DonationList;

const styles = StyleSheet.create({

    flatListContainer: {
  
  
 
      },
})