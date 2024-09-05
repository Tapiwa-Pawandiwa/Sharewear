import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { FontAwesome5,FontAwesome ,Ionicons, Entypo, MaterialCommunityIcons,MaterialIcons, AntDesign} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface TabIconProps {
  label: string;
  name: string;
  focused: boolean;
  library: 'FontAwesome' | 'FontAwesome5' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'AntDesign' | 'Entypo';
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused ,library,label}) => {
    let IconComponent;

    switch (library) {
      case 'FontAwesome':
        IconComponent = FontAwesome;
        break;
      case 'FontAwesome5':
        IconComponent = FontAwesome5;
        break;
      case 'Entypo':
        IconComponent = Entypo;
        break;
      default:
        IconComponent = FontAwesome;
        break;
    }
 
    return (
      <View style={[styles.container, focused ? styles.focusedContainer : null]}>
      <IconComponent
        name={name}
        size={focused? 35 : 25}
        color={focused ? Colors.green.main : Colors.grey.light}
        style={styles.icon}
      />
      <Text style={[styles.labelText, focused ? styles.focusedlabel : null]}>
        {label}
      </Text>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, 
    marginTop: 30,
    height: 80,
  },
  focusedContainer: {
    borderRadius: 50, // Ensures the background is circular
    paddingVertical: 10, // Adds some padding to the top and bottom
    paddingHorizontal: 20, // Adds some padding to the sides
  },
  focusedTabItem: {
    backgroundColor: Colors.green.alt,
    borderRadius: 35,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 5,
  },
  labelText: {
    color: Colors.grey.light,
    fontSize: 12,
    fontFamily: 'Now-Regular',
    textAlign: 'center',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  focusedlabel: {
    color: Colors.green.main,
    fontSize: 14,
    width: 100,
  },

});

export default TabIcon;
