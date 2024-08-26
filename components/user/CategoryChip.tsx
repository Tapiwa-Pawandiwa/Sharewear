import Colors from "@/constants/Colors";
import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import {Ionicons,MaterialIcons,MaterialCommunityIcons, FontAwesome5,FontAwesome6, FontAwesome,AntDesign, Entypo} from "@expo/vector-icons";

type CategoryProps = {
  category: {
    id: string;
    name: string;
    icon_name: string | null; // Allowing null here
  };
  isSelected: boolean;
  onPress: (categoryId: string) => void;
};


const getIconComponent = (iconName: string,isSelected: boolean) => {
  if (!iconName) return null; // Handle the null case

  const iconMap: { [key: string]: any } = {
    AntDesign,
    Entypo,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons
    // Add other mappings here
  };

  // Split the iconName into the library name and the icon name
  const [library, icon] = iconName.split(':');

  // Get the Icon component from the appropriate library
  const IconComponent = iconMap[library];

  if (!IconComponent) {
    console.warn(`Icon library ${library} not found`);
    return null;
  }

  return (
    <View
      style={[
        styles.iconContainer,
        isSelected && styles.selectedIconContainer,
      ]}
    >
      <IconComponent name={icon} size={36} color={isSelected ? 'white' : Colors.theme.background} />
    </View>
  );};

const CategoryChip: React.FC<CategoryProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => onPress(category.id)}
      style={[styles.chipContainer]}
    >
    <View style={styles.chip}>
        {getIconComponent(category.icon_name ?? '', isSelected)}
        <Text
          style={[
            styles.chipText,
            isSelected ? styles.selectedChipText : styles.unselectedChipText,
          ]}
        >
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default CategoryChip;

const styles = StyleSheet.create({
  chipContainer: {
    
    marginVertical: 4,
  },
  iconContainer: {
    borderRadius: 35,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    
  },
  selectedIconContainer: {
    backgroundColor: Colors.green.alt,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  chipText: {
    fontSize: 14,
    color: "black",
  },
  unselectedChipText: {
    color: "black",
  },
  selectedChipText: {
    color: "black",
  },
});
