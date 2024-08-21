import { View, StyleSheet, Text,FlatList } from 'react-native'
import React, { useState } from 'react'
import FilterChip from './FilterChip';


const filterOptions = ['All', 'Available', 'Pending', 'Complete'];

type FilterChipListProps = {
  onFilterChange?: (filter: string) => void; // Optional prop
};


export default function FilterChipList({ onFilterChange }: FilterChipListProps) {
    const [selectedFilter, setSelectedFilter] = useState('All');


    const handlePress = (name: string) => {
        setSelectedFilter(name);
        if (onFilterChange) {
          onFilterChange(name); // Call the parent function to filter the data if provided
        }
      };
    
  return (
    <FlatList
    data={filterOptions}
    keyExtractor={(item) => item}
    horizontal
    renderItem={({ item }) => (
      <FilterChip
        name={item}
        isSelected={item === selectedFilter}
        onPress={handlePress}
      />
    )}
    contentContainerStyle={styles.container}
    showsHorizontalScrollIndicator={false}
  />
    
  )
}

const styles  = StyleSheet.create({
    container: {
    },

 
})