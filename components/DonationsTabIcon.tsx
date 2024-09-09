import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface TabIconProps {
  label: string;
  focused: boolean;
  pendingCount?: number; 
}

const DonationsTabIcon: React.FC<TabIconProps> = ({ focused, label, pendingCount=0 }) => {
  return (
    <View style={[styles.container, focused ? styles.focusedContainer : null]}>
      <View style={styles.iconContainer}>
      <FontAwesome5
          name="box"
          size={focused ? 20 : 15}
          color={focused ? Colors.green.main : Colors.grey.light}
          style={styles.boxIcon}
        />
        <FontAwesome5
          name="hand-holding"
          size={focused ? 35 : 25}
          color={focused ? Colors.green.main : Colors.grey.light}
          style={styles.handIcon}
        />
           {pendingCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        )}
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
  badge: {
    position: 'absolute',
    bottom: 18,
    left: 32, 
    backgroundColor: Colors.theme.tertiary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },badgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default DonationsTabIcon;
