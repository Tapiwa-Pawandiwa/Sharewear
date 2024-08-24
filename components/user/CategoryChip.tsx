import Colors from "@/constants/Colors";
import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import {Ionicons,MaterialIcons,MaterialCommunityIcons, FontAwesome5,FontAwesome6, FontAwesome,AntDesign, Entypo} from "@expo/vector-icons";

type CategoryProps = {
  category: {
    id: string;
    name: string;
    icon_name: string;
  };
  isSelected: boolean;
  onPress: (categoryId: string) => void;
};


const getIconComponent = (iconName: string) => {
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

  return <IconComponent name={icon} size={20} color="black" />;
};

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
      <View
        style={[
          styles.chip,
          isSelected ? styles.selectedChip : styles.unselectedChip,
        ]}
      >
        <Text
          style={[
            styles.chipText,
            isSelected ? styles.selectedChipText : styles.unselectedChipText,
          ]}
        >
          {category.name}

        </Text>
        {getIconComponent(category.icon_name)}
         </View>
    </Pressable>
  );
};

export default CategoryChip;

const styles = StyleSheet.create({
  chipContainer: {
    marginHorizontal: 2,
    marginVertical: 4,
  },
  chip: {
 
    paddingHorizontal: 15, // Ensures consistent padding
    paddingVertical: 10, // Ensures consistent padding
    
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    minWidth: 70, // Minimum width to handle short texts
  },
  unselectedChip: {
    backgroundColor: Colors.theme.accent,
  },
  unselectedChipText: {
    color: "black",
  },
  selectedChip: {
    backgroundColor: "green",
  },
  chipText: {
    color: "black",
    fontSize: 14,
  },
  selectedChipText: {
    color: "white",
  },
});
