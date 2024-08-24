import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View ,Pressable,FlatList} from 'react-native';
import Chip from './Chip';
import { supabase } from '@/lib/supabase';
import { useFormContext } from '@/app/providers/Form';

const TagSelector: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const {formData, addTag, removeTag}= useFormContext();
  
  const [availableTags, setAvailableTags] = useState<{ id: number, name: string }[] | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      let { data: tags, error } = await supabase
      .from('tags')
     .select('*')
      
     if (error) {
       console.log('Error fetching tags', error.message);
       return;
     }else {
        setAvailableTags(tags);
     }
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
