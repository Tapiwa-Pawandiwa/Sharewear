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
        <Text style={styles.heading}>My Donations</Text>
          <Image
            source={require("@/assets/images/birdbox.png")}
            style={styles.headImage}
          />
       
        </View>
      </View>
      <DonationList />
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
    marginTop: 50,
    justifyContent: 'space-between',
    alignSelf: "center",
  },

  heading: {
    fontSize: 30,
    fontFamily: "LeagueSpartan-Regular",
  },
  headImage: {
    width: 60,
    height: 60,
    marginLeft: 80,
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
