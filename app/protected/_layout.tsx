import { Slot } from "expo-router";
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {Stack} from "expo-router";
import React from "react";
import { useColorScheme } from '@/components/useColorScheme';

 function ProtectedLayout () {
    const colorScheme = useColorScheme();
    return (
         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="createRequest/RequestStepOne" options={{ headerShown: false }} />
        <Stack.Screen name="createRequest/RequestStepTwo" options={{ headerShown: false }} />
        <Stack.Screen name="createRequest/RequestStepThree" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
    );
}

export default withAuthenticator(ProtectedLayout);
