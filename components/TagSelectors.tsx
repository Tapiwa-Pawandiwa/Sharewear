import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View ,Pressable,FlatList} from 'react-native';
import Chip from './Chip';

const TagSelector: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Disability',
    'Refugee',
    'Family',
    'Homeless',
    'Mental Health',
    'School',
    'Children',
    'Elderly',
    'Health',
    'Food',
    'Single Parent',
    'LGBTQ+',
    'Charity',
    'Women',
  ]);

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

return (
    <FlatList
        data={availableTags}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            tag={item}
            isSelected={selectedTags.includes(item)}
            onPress={handleSelectTag}
          />
        )}
        numColumns={3} // Customize this value for random layout effect
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.tagContainer}
      />
  );
};

export default TagSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  column: {
    justifyContent: 'flex-start',
  },
  tagContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    margin: 4,
  },
  selectedChip: {
    backgroundColor: 'green',
  },
  chipText: {
    color: 'black',
  },
  selectedChipText: {
    color: 'white',
  },
});
