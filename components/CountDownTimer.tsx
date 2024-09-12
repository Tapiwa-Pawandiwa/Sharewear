import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {Tables} from '@/app/database.types';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';

type donationTimers = Tables<'donation_timers'>;
type Donation = Tables<'donation'>;

interface CountdownTimerProps {
  createdTime: string; // The time in ISO format
  donationId: number | null;
}
//update 
const CountdownTimer: React.FC<CountdownTimerProps> = ({ createdTime, donationId }) => {
  const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
  
  // Parse the ISO 8601 string
  const createdDate = new Date(createdTime).getTime(); // Converts to timestamp (ms)
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerCanceled, setTimerCanceled] = useState<boolean>(false); // Track if the timer is canceled
  const [donationComplete, setDonationComplete] = useState<boolean>(false); // Track if the donation is complete


  useEffect(() => {
    const timerChannel = supabase
      .channel('donation-timer-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donation_timers', filter: `donation_id=eq.${donationId}` },
        (payload) => {
          const updatedTimer = payload.new as donationTimers;
          setTimerCanceled(updatedTimer.timer_canceled ?? false);
        }
      )
      .subscribe();

    const donationChannel = supabase
      .channel('donation-status-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donation', filter: `id=eq.${donationId}` },
        (payload) => {
          const updatedDonation = payload.new as Donation;
          if (updatedDonation.status === 'COMPLETE') {
            setDonationComplete(true);
            setTimeLeft(0); // Stop the timer if the donation is complete
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(timerChannel);
      supabase.removeChannel(donationChannel);
    };
  }, [donationId]);

  useEffect(() => {
    if (timerCanceled) return; // If the timer is canceled, don't start the countdown

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
  }, [createdTime, timerCanceled,donationComplete]);


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
    <Animated.View style={[styles.timerContainer, animatedStyle]}>
    <Image
      style={styles.timeImage}
      source={require("@/assets/icons/time.png")}
      contentFit="contain"
    />
    {donationComplete ? (
      <Text style={styles.timerText}>Complete</Text>
    ) : timerCanceled ? (
      <Text style={styles.timerText}>Expired</Text>
    ) : timeLeft > 0 ? (
      <Text style={styles.timerText}>{`${minutes} min ${seconds} sec`}</Text>
    ) : (
      <Text style={styles.timerText}>Expired</Text>
    )}
  </Animated.View>
  );
};

export default CountdownTimer;

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  
  },
  timerText: {
    fontSize: 12,
    color: Colors.red.hard,
    fontFamily: 'Now-light',
    
  },
  timeImage: {
    width: 45,
    height: 30,
  },
});
