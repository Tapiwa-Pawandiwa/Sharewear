import Colors from '@/constants/Colors';
import React from 'react';
import { Pressable, Text, StyleSheet,View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ChipProps = {
  tag: string;
  isSelected: boolean;
  onPress: (tag: string) => void;
};

const Chip: React.FC<ChipProps> = ({ tag, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(tag)}
      style={styles.chipContainer}
    >
      {isSelected ? (
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    colors={[Colors.green.main, Colors.green.alt]}
    style={styles.chip}
  >
    <Text style={[styles.chipText, styles.selectedChipText]}>{tag}</Text>
  </LinearGradient>
) : (
  <View style={[styles.chip, styles.unselectedChip]}>
    <Text style={[styles.chipText, styles.unselectedChip]}>
      {tag}
    </Text>
  </View>
)}
    </Pressable>


  );
};

export default Chip;

const styles = StyleSheet.create({
  chipContainer:{
marginHorizontal: 2,
marginVertical: 4,

  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 15, // Ensures consistent padding
    paddingVertical: 10, // Ensures consistent padding
    backgroundColor: Colors.theme.accent,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    minWidth: 70, // Minimum width to handle short texts

   
  },
  unselectedChip: {
    backgroundColor: Colors.theme.accent,
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
  timeImage: {
    width: 45,
    height: 30,
  },
});
