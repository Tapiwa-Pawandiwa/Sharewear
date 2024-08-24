import React, { useEffect, useState } from 'react';
import { View, Text , FlatList,StyleSheet} from 'react-native';

import { useCategories, useDonationRequests } from '@/app/hooks/useDonationRequests';
import CategoryChip from './CategoryChip';



const CategoryList = () => {
  const { data: categories, isLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);


  const handlePress = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Navigation logic will be added later
  };


useEffect(() => {

      console.log(categories);
    
  }
  , [categories]);

  if (isLoading) {
    return <Text>Loading...</Text>; // Add a loading indicator or message
  }

  return (
    <View>
     <FlatList
        data={categories}
  renderItem={({ item }) => (
          <CategoryChip
            category={item}
            isSelected={item.id === selectedCategoryId}
            onPress={handlePress}
          />
        )}        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      /> 
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 10, // Add padding to the start and end of the FlatList
  },
});