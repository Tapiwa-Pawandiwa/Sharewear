import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RoundedButton from "../RoundedButton";
import { Image } from "expo-image";
import { Tables } from "@/app/database.types";
import CountdownTimer from "../CountDownTimer";
import Badge from "../Badge";
import { supabase } from "@/lib/supabase";
import { useDonorContext } from "@/app/providers/Donor";

type DonationWithDetails = Tables<"donation_with_details">;
type Donation = Tables<"donation">;

interface DonationCardProps {
  donation: DonationWithDetails;
  donationStatus: string;
  timerCanceled: boolean;
  type?: "donor" | "requester";
  onManage?: () => void;
  onCancelDonation: () => Promise<void>; // Updated to return a Promise<void>
}

const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  type,
  onManage,
  donationStatus,
  timerCanceled,
  onCancelDonation,
}) => {
  const { cancelDonation } = useDonorContext();
  const [isCancelled, setIsCancelled] = useState(false);

  return (
    <View style={styles.container}>
      {donation.images && donation.images.length > 0 ? (
        <Image
          source={{ uri: donation.images[0] }}
          style={styles.donationImage}
          cachePolicy="memory-disk"
          placeholder={{ uri: "https://via.placeholder.com/150" }}
          testID="donation-image"
        />
      ) : (
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.donationImage}
          testID="donation-image"
        />
      )}
      <View style={styles.donationRequest}>
        <Text style={styles.headlineText}>
          {donation.donation_request_headline || "Donation Request"}
        </Text>

        {donation.donation_status === "COMPLETE" && type === "requester" ? (
          <Text style={styles.donorName}>
            {donation.first_name || ""} donated
          </Text>
        ) : (
          <Text style={styles.addressText} numberOfLines={2}>
            {donation.donation_request_address || "Address not available"}
          </Text>
        )}
      </View>

      <View style={styles.timer}>
        <CountdownTimer
          createdTime={donation.timer_start_time ?? ""}
          donationId={donation.donation_id}
          timerCanceled={timerCanceled}
          donationComplete={donationStatus === "COMPLETE"}
          testID="countdown-timer"
        />
        {donationStatus === "PENDING" && type === "donor" && !isCancelled && (
          <RoundedButton
            title="Cancel"
            onPress={async () => {
              try {
                await onCancelDonation();
                setIsCancelled(true); // Handled as an async function
              } catch (error) {
                console.error("Failed to cancel donation:", error);
              }
            }}
            textStyle={styles.cancelText}
            buttonStyle={styles.cancelButton}
          />
        )}
      </View>
    </View>
  );
};

export default DonationCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey.background,
    borderRadius: 35,
    width: "92%",
    height: 125,
    alignSelf: "center",
    alignItems: "center", // Align items in the center of the cross-axis
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
  },
  donationImage: {
    width: 100,
    height: 80,
    borderRadius: 30,
  },
  timeContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  timer: {},

  timeText: {
    color: Colors.grey.dark,
    fontSize: 16,
  },
  donorName: {
    color: Colors.theme.secondContrast,
    fontSize: 14,
    marginBottom: 5,
    maxWidth: 120,
  },
  addressText: {
    color: Colors.grey.dark,

    fontFamily: "Now-Light",
    fontWeight: "100",
    fontSize: 10,
    maxWidth: 130,
    marginBottom: 10,
  },
  headlineText: {
    color: Colors.grey.dark,
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "LeagueSpartan-Regular",
    lineHeight: 16,
    width: 130,
  },
  donationRequest: {
    flex: 1, // Take available space
    margin: 10,
    width: 100,
  },
  button: {
    backgroundColor: Colors.red.hard,
    alignContent: "center",
    width: 90,
    height: 30,
    marginTop: 20,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Helvetica",
    alignSelf: "center",
    justifyContent: "center",
  },
  manageButton: {
    backgroundColor: Colors.beige.main,
    width: 80,
    marginTop: 20,
    borderRadius: 20,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  manageText: {
    color: "black",
    fontSize: 11,
    fontFamily: "Helvetica",
    alignSelf: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Helvetica",
    alignSelf: "center",
  },
  cancelButton: {
    backgroundColor: Colors.red.hard,
    alignContent: "center",
    width: 80,
  },
});
