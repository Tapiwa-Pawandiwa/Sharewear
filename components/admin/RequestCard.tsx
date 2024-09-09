import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RoundedButton from "../RoundedButton";
import Colors from "@/constants/Colors";
import RemoteImage from "../RemoteImage";
import { Tables } from "@/app/database.types";
import { Image } from "expo-image";


type DonationRequest = Tables<'donation_requests_with_categories_and_tags'>;

interface RequestCardProps {
  onManage: () => void;
donationRequest: DonationRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({
  donationRequest,
  onManage
}) => {


  //Add max quanity for the amount of characters in the description
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: donationRequest.images?.[0] }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <View style={styles.heading}>
        <Text style={styles.headlineStyle}>{donationRequest.headline}</Text>
        <Text style={styles.statusStyle}>Status: {donationRequest.status}</Text>
        <Text style={styles.itemStyle}>{donationRequest.item_names?.length} Items</Text>
      </View>
      <View style={styles.manageButtonContainer}>
        <RoundedButton
          title="Manage"
          buttonStyle={styles.manageButton}
          textStyle={styles.buttonText}
          onPress={onManage}
        />
      </View>
    </View>
  );
};

export default RequestCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    alignItems: "center",
    padding: 15,
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: Colors.grey.card,
    alignSelf: "center",
    width: "90%",
    borderRadius: 35,
    position: "relative", // To make the button positioning relative to the card
  },
  heading: {
    marginLeft: 10,
    maxWidth: 150,
  },
  headlineStyle: {
    fontSize: 14,
    marginBottom: 5,  
    color: Colors.grey.dark,
  

  },
  statusStyle: {
    fontSize: 12,
    color: Colors.theme.primary,
    marginBottom: 5,
    fontFamily: "Now-Light",
  },
  descriptionStyle: {
    fontSize: 16,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 5,
  },
  locationStyle: {
    fontSize: 10,
    width: 140,
    marginBottom: 5,
    color: "black",
    fontFamily: "Now-Light",
  },
  itemStyle: {
    fontSize: 12,
    color: "black",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  manageButton: {
    position: "absolute",
    backgroundColor: Colors.beige.main,
    width: 90,
    marginTop: 20,
    right: 10,
    height: 30,

    justifyContent: "center",
    alignContent: "center",
   

  },
  buttonText: {
    color: "black",
    fontSize: 12,
    lineHeight: 10,
  },
  manageButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 30, // Ensure the button is at the bottom
    right: 10,
    position: "absolute", // Absolute positioning to place the button

  }
});
