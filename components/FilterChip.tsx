import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

type FilterChipProps = {
  name: string;
  isSelected: boolean;
  onPress: (name: string) => void;
};

const FilterChip: React.FC<FilterChipProps> = ({
  name,
  isSelected,
  onPress,
}) => {
  return (
    <Pressable onPress={() => onPress(name)} style={styles.chipContainer}>
      {isSelected ? (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={[Colors.green.main, Colors.green.alt]}
          style={styles.chip}
        >
          <Text style={[styles.chipText, styles.selectedChipText]}>{name}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.chip, styles.unselectedChip]}>
          <Text style={[styles.chipText, styles.unselectedChipText]}>
            {name}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default FilterChip;

const styles = StyleSheet.create({
  chipContainer: {
    marginHorizontal: 3,
  },
  chip: {
    borderRadius: 20,
    backgroundColor: Colors.theme.tertiary,
    margin: 4,
    width: 80,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedChip: {
    borderWidth: 0,
  },
  chipText: {
    color: "black",
    fontSize: 12,
  },
  selectedChipText: {
    color: "white",
  },
  unselectedChip: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "grey",
  },
  unselectedChipText: {
    color: "black",
  },
});
