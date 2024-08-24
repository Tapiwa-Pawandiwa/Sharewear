import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { FontAwesome5,FontAwesome ,Ionicons, Entypo, MaterialCommunityIcons,MaterialIcons, AntDesign} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface TabIconProps {
  name: string;
  focused: boolean;
  library: 'FontAwesome' | 'FontAwesome5' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'AntDesign' | 'Entypo';
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused ,library}) => {
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
        <View style={[
            styles.tabItem,
            focused ? styles.focusedTabItem : null
          ]}>
            <IconComponent
              name={name}
              size={25}
              color={focused ? Colors.green.main : Colors.grey.light}
              style={styles.icon}
            />
          </View>
  );
};

const styles = StyleSheet.create({
  tabView: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    marginBottom: 0,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    margin: 5,
    padding: 5,
    height: 50,
    width: 60,
    marginTop: 30
  },
  tabText: {
    fontSize: 10,
    textAlign: "center",
  },
  focusedTabItem: {
    backgroundColor: '#fff',
    borderRadius: 35,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: -3,
  },
});

export default TabIcon;
