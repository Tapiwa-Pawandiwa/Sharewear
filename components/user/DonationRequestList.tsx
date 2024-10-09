import React, { useEffect, useState } from 'react';
import { View, Text , FlatList,StyleSheet, ActivityIndicator} from 'react-native';
import DonationRequestCard from './DonationRequestCard';
import { useCategories, useDonationRequests, useDonationRequestsWithCategory } from '@/app/hooks/useDonation';
import { CustomAlertModal } from '../CustomAlertModal';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/providers/Auth';


type DonationRequestListProps = {
  categoryId?: string | null; // Allow categoryId to be optional
  type?: 'category' | null

};


const DonationRequestList: React.FC<DonationRequestListProps> = ({ categoryId = null }) => {
  const { data: donationRequestsWithCategory, isLoading, refetch } = useDonationRequestsWithCategory()
  const { data: categories } = useCategories();
  const [loading, setLoading] = React.useState(false);
  const [filteredRequests, setFilteredRequests] = useState(donationRequestsWithCategory);

 
  useEffect(() => {
    const channel = supabase.channel('donation-request-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donation_requests_with_categories_and_tags' },
        (payload) => {
          refetch(); // Refetch donation requests when a change occurs
        }
      )
      .subscribe();
  
    // Cleanup the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);


  useEffect(() => {
    if (categoryId && donationRequestsWithCategory && categories) {
      // Find the corresponding category name for the selected category ID
      const selectedCategory = categories.find(category => category.id === categoryId);
      const selectedCategoryName = selectedCategory ? selectedCategory.name : null;

      if (selectedCategoryName) {
        const filtered = donationRequestsWithCategory.filter(request =>
          request.category_names?.includes(selectedCategoryName)
        );
        setFilteredRequests(filtered);
      } else {
        setFilteredRequests([]);
      }
    } else {
      setFilteredRequests(donationRequestsWithCategory);
    }
  }, [categoryId, donationRequestsWithCategory, categories]);


  if (!filteredRequests || filteredRequests.length === 0) {
    return (
      <View>
      <ActivityIndicator 
        color={Colors.theme.primary}
        size={100}
      />
    </View>
    );
  }

  if (isLoading) {
    return (
      <View>
      <ActivityIndicator 
        color={Colors.theme.primary}
        size={100}
      />
    </View>
  ); // Add a loading indicator or message
  }


  return (
    <View >
      <FlatList
        data={filteredRequests}
        renderItem={({ item }) => <DonationRequestCard donationRequest={item} />}
        keyExtractor={(item) => item.donation_request_id?.toString() || 'fallback-key'}
        horizontal// Only horizontal if type is not 'category'
        contentContainerStyle={styles.flatListContainer}
      />
  
    </View>
  );
};

export default DonationRequestList;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 10,
    // Add padding to the start and end of the FlatList
  },

});