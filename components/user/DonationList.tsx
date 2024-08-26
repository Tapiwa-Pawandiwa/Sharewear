import React, { useEffect, useState } from 'react';
import { View, Text , FlatList,StyleSheet, ActivityIndicator} from 'react-native';
import DonationCard from './DonationCard';
import { useCategories, useDonationRequests, useDonationRequestsWithCategory } from '@/app/hooks/useDonationRequests';
import { CustomAlertModal } from '../CustomAlertModal';
import Colors from '@/constants/Colors';


type DonationListProps = {
  categoryId?: string | null; // Allow categoryId to be optional
};


const DonationList: React.FC<DonationListProps> = ({ categoryId = null }) => {
  const { data: donationRequestsWithCategory, isLoading } = useDonationRequestsWithCategory()
  const { data: categories } = useCategories();
  const [loading, setLoading] = React.useState(false);
  const [filteredRequests, setFilteredRequests] = useState(donationRequestsWithCategory);

 
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
    return <Text>No donation requests found.</Text>;
  }

  if (isLoading) {
    return <ActivityIndicator color={Colors.green.alt}/>; // Add a loading indicator or message
  }

  return (
    <View >
      <FlatList
        data={filteredRequests}
        renderItem={({ item }) => <DonationCard donationRequest={item} />}
        keyExtractor={(item) => item.donation_request_id?.toString() || 'fallback-key'}
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