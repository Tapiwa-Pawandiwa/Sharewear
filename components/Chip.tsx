import Colors from '@/constants/Colors';
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type ChipProps = {
  tag: string;
  isSelected: boolean;
  onPress: (tag: string) => void;
};

const Chip: React.FC<ChipProps> = ({ tag, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(tag)}
      style={[styles.chip, isSelected && styles.selectedChip]}
    >
      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
        {tag}
      </Text>
    </Pressable>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.beige.main,
    margin: 4,
    borderWidth: 1,
    borderColor: 'black',
  },
  selectedChip: {
    backgroundColor: 'green',
  },
  chipText: {
    color:'black',
    fontSize: 14,
  },
  selectedChipText: {
    color: 'white',
  },
});
