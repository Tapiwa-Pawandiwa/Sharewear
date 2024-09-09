import { View, StyleSheet, Text,FlatList } from 'react-native'
import React, { useState } from 'react'
import FilterChip from './FilterChip';



type FilterChipListProps = {
  onFilterChange?: (filter: string) => void; // Optional prop
  type? : 'requests' | 'donation';
};



export default function FilterChipList({ onFilterChange,type }: FilterChipListProps) {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filterOptions = ['All', 'Available', 'Pending', 'Complete'];
    if (type === 'donation') {
        filterOptions.push('Failed');
    } 

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
        onPress={() => handlePress(item)} // Correctly invoke handlePress
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