import { useDonationRequests } from "@/app/hooks/useDonation";
import Colors from "@/constants/Colors";
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import RemoteImage from "../RemoteImage";
import {Image} from 'expo-image'
import { Tables } from "@/app/database.types";
import { Link } from "expo-router";

type DonationRequestWithCategoryAndTags =
  Tables<"donation_requests_with_categories_and_tags">;

interface DonationRequestCardProps {
  donationRequest: DonationRequestWithCategoryAndTags; // Update the type here
}
const DonationRequestCard: React.FC<DonationRequestCardProps> = ({ donationRequest }) => {

  return (
    <Link 
    href={{
      pathname: '/donationRequest/[id]',
      params: {
        id: donationRequest.donation_request_id,
      },
    }}
    >

    <View style={styles.container}>
      <Carousel<string> // Explicitly define the type as string
        data={donationRequest.images || []} // Pass the images array
        renderItem={({ item }) => (
          <Image
            source={item}
            style={styles.image}
            contentFit="cover"
            placeholder={{uri: "https://via.placeholder.com/150"}}
            cachePolicy="memory-disk" //'memory-disk' - Image is cached in memory, but with a fallback to the disk cache.
          />
        )}
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
    </Link>
  );
};

export default DonationRequestCard;

const styles = StyleSheet.create({
  container: {
    width: 210,
    height: 150,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "black",

    margin: 10,
    // Works only on Android
  },
  image: {
    width: 210,
    height: 100,
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 10,
  },
  textContainer: {
    padding: 10,
    height: 40,

    marginLeft: -5,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 5,
    fontWeight: 400,
    lineHeight: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    fontFamily: "LeagueSpartan-Light",
  },
});
