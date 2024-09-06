import DonationList from "@/components/user/DonationList";
import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const myDonations = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.innerContainer}>
          <Image
            source={require("@/assets/images/birdbox.png")}
            style={styles.headImage}
          />
          <Text style={styles.heading}>My Donations</Text>
        </View>
      </View>
      <View style={styles.listContainer}>
        <DonationList />
      </View>
    </View>
  );
};

export default myDonations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  headerContainer: {
    height: 180,
    borderRadius: 40,
    width: "95%",
    marginTop: 20,
    marginLeft: 10,
 
    padding: 15,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
    marginTop: 30,
    alignSelf: "center",
  },

  heading: {
    fontSize: 30,
    fontFamily: "LeagueSpartan-Regular",
  },
  headImage: {
    width: 100,
    height: 100,
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
