// app/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from './providers/Auth';
const Index = () => {
  const router = useRouter();
  const { session, isAdmin } = useAuth();

  useEffect(() => {
    const determineInitialRoute = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding) {
        // Redirect based on user role or session status
        if (session) {
          router.replace(isAdmin ? '/(admin)' : '/(user)');
        } else {
          router.replace('/(auth)/sign-in');
        }
      } else {
        // Go to onboarding if the user hasn't seen it
        router.replace('/Onboarding');
      }
    };

    determineInitialRoute();
  }, [session, isAdmin]);

  // Display a loading state while determining the initial route
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
});