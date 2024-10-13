import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View ,Pressable,FlatList} from 'react-native';
import Chip from './Chip';
import { supabase } from '@/lib/supabase';
import { useFormContext } from '@/app/providers/Form';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '@/constants/Colors';

const TagSelector: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const {formData, addTag, removeTag}= useFormContext();
  const [loading, setLoading] = useState(true); // Loading state

  const [availableTags, setAvailableTags] = useState<{ id: number, name: string }[] | null>(null);
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true); // Start loading
      let { data: tags, error } = await supabase
        .from('tags')
        .select('*');

      if (error) {
        console.log('Error fetching tags', error.message);
      } else {
        setAvailableTags(tags);
      }
      setLoading(false); // Stop loading
    };

    fetchTags();
  }, []);

  const handleSelectTag = (tag: { id: number, name: string }) => {
    if (formData.tags.find(t => t.id === tag.id)) {
      removeTag(tag.id);
    } else {
      addTag(tag);
    }
  };

  if (loading) {
    // Show activity indicator while loading
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.theme.primary} />
        <Text style={styles.loadingText}>Loading tags...</Text>
      </View>
    );
  }
return (
    <FlatList
        data={availableTags}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Chip
            tag={item.name}
            isSelected={!!formData.tags.find(t => t.id === item.id)} // Convert to boolean
            onPress={() => handleSelectTag(item)}
          />
        )}
        numColumns={4} // Customize this value for random layout effect
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.tagContainer}
      />
  );
};

export default TagSelector;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 10,
  },  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  column: {
    justifyContent:'center',
   paddingHorizontal: 10,
  },
  tagContainer: {
    padding: 20,
    alignSelf: 'center',
    width: '100%',
  },
  chip: {
    margin: 10,
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
