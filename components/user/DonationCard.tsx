import { useDonationRequests } from "@/app/hooks/useDonationRequests";
import Colors from "@/constants/Colors";
import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import RemoteImage from "../RemoteImage";
import { Tables } from "@/app/database.types";

type DonationRequest = Tables<"donationRequest">;

interface DonationCardProps {
  donationRequest: DonationRequest;
}

const DonationCard: React.FC<DonationCardProps> = ({ donationRequest }) => {
  const renderImageItem = ({ item }: { item: string }) => {
    return (
      <RemoteImage
        path={item}
        style={styles.image}
        fallback="https://via.placeholder.com/150"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Carousel<string> // Explicitly define the type as string
        data={donationRequest.images || []} // Pass the images array
        renderItem={renderImageItem}
        width={210}
        height={100}
        loop
        style={styles.image}
      />

<View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {donationRequest.headline}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {donationRequest.formatted_address}
        </Text>
      </View>
   </View>
   
  );
};

export default DonationCard;

const styles = StyleSheet.create({
  container: {
    width: 210,
    height: 180,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "black",
   
    margin: 10,
    // Works only on Android
  },
  image: {
    width: 210,
    height: 100,
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 25,
    marginBottom: 10,
  },
  textContainer: {
    padding: 10,
    height: 60,
    marginBottom: 20,
    marginLeft: -5,
    justifyContent: "center",
    
  },
  title: {
    fontSize: 16,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 5,
    fontWeight: 400,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    fontFamily: "LeagueSpartan-Light",
  },
});
