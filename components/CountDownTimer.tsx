import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface CountdownTimerProps {
  createdTime: string; // The time in ISO format
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ createdTime }) => {
  const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
  
  // Parse the ISO 8601 string
  const createdDate = new Date(createdTime).getTime(); // Converts to timestamp (ms)
  
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
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
  }, [createdTime]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(timeLeft > 0 ? 1 : 0.5), // Example animation
    };
  });

  // Convert time left to minutes and seconds
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <Animated.View style={[styles.timerContainer, animatedStyle]}>
      {timeLeft > 0 ? (
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
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff0000', // Red for urgency
    fontFamily: 'Now-Bold',
  },
});
