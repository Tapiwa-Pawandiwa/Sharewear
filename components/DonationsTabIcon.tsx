import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface TabIconProps {
  label: string;
  focused: boolean;
}

const DonationsTabIcon: React.FC<TabIconProps> = ({ focused, label }) => {
  return (
    <View style={[styles.container, focused ? styles.focusedContainer : null]}>
      <View style={styles.iconContainer}>
      <FontAwesome5
          name="box"
          size={focused ? 20 : 15}
          color={focused ? Colors.green.main : Colors.grey.light}
          style={styles.boxIcon}
        />
        {/* Second Icon: Hand */}
        <FontAwesome5
          name="hand-holding"
          size={focused ? 35 : 25}
          color={focused ? Colors.green.main : Colors.grey.light}
          style={styles.handIcon}
        />
      </View>
      <Text style={[styles.labelText, focused ? styles.focusedLabel : null]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    marginTop: 30,
  },
  focusedContainer: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconContainer: {
    position: "relative", // Enables absolute positioning for the child icons
  },
  handIcon: {
    marginTop: 2, // Positions the hand icon slightly below the box icon
  },
  boxIcon: {
    position: "absolute", // Positions the box icon on top of the hand
    top: 0,
    left:10,
  },
  labelText: {
    color: Colors.grey.light,
    fontSize: 12,
    width: 100,
    fontFamily: "Now-Regular",
    textAlign: "center",
    marginTop: 5,
  },
  focusedLabel: {
    color: Colors.green.main,
    fontSize: 14,
    width: 100,
  },
});

export default DonationsTabIcon;
