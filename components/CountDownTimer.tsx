import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Tables } from "@/app/database.types";
import { supabase } from "@/lib/supabase";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import Badge from "./Badge";

type donationTimers = Tables<"donation_timers">;
type Donation = Tables<"donation">;

interface CountdownTimerProps {
  createdTime: string; // The time in ISO format
  donationId: number | null;
  timerCanceled: boolean;
  donationComplete: boolean;
  testID?: string;  // Add the testID prop

}
//update
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  createdTime,
  donationId,
  timerCanceled,
  donationComplete,
  testID,

}) => {
  const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

  // Parse the ISO 8601 string
  const createdDate = new Date(createdTime).getTime(); // Converts to timestamp (ms)

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (timerCanceled || donationComplete) return; // Stop the countdown if the timer is canceled or the donation is complete
    const createdDate = new Date(createdTime).getTime();
    const now = Date.now();
    const expirationTime = createdDate + FIVE_MINUTES_IN_MS;
    const initialTimeLeft = expirationTime - now;

    if (initialTimeLeft > 0) {
      setTimeLeft(initialTimeLeft);
      const interval = setInterval(() => {
        const currentTimeLeft = expirationTime - Date.now();
        if (currentTimeLeft <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(currentTimeLeft);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(0); // Expired if the time is in the past
    }
  }, [createdTime, timerCanceled, donationComplete]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(timeLeft > 0 ? 1 : 1), // Example animation
    };
  });

  // Convert time left to minutes and seconds
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <Animated.View style={[styles.timerContainer, animatedStyle]} testID={testID}>
      {donationComplete ? (
        <View style={styles.badgeContainer}>
          <Badge text="Complete" />
        </View>
      ) : timerCanceled ? (
        <View style={styles.birdContainer}>
          <Image
            style={styles.timeImage}
            source={require("@/assets/icons/time.png")}
            contentFit="contain"
          />
          <Text style={styles.timerText}>Expired</Text>
        </View>
      ) : timeLeft > 0 ? (
        <Text style={styles.timerText}>{`${minutes} min ${seconds} sec`}</Text>
      ) : (
        <View style={styles.birdContainer}>
          <Image
            style={styles.timeImage}
            source={require("@/assets/icons/time.png")}
            contentFit="contain"
          />
          <Text style={styles.timerText}>Expired</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default CountdownTimer;

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  timerText: {
    fontSize: 12,
    color: Colors.red.hard,
    fontFamily: "Now-light",
  },
  timeImage: {
    width: 45,
    height: 30,
  },
  badgeContainer: {
    alignContent: "center",
  },
  birdContainer: {
    right: 20,
  },
});
