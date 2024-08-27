import { View, Text ,Pressable,StyleSheet} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/providers/Auth';

const BackButton = () => {
    const router = useRouter(); // Access the router for navigation
    const {isAdmin} = useAuth();

  return (
    
    <Pressable onPress={() => router.push(isAdmin? `/(admin)` : `/(user)`)} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color={Colors.dark.background} />
  </Pressable>

  )
}

export default BackButton;


const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40, // Adjust this value as needed to place it below the status bar
        left: 15,
        width: 40,
        height: 40,
        borderRadius: 20, // Makes the button round
        backgroundColor: Colors.theme.accent, // The background color of the button
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensures it is on top of other content
      },
});