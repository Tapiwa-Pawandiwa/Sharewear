import { Slot } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {Stack} from "expo-router";
import React from "react";
import { Redirect } from "expo-router";
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from "../providers/Auth";

 function ProtectedLayout () {
    const colorScheme = useColorScheme();
    const {session,profile, loading, isAdmin} = useAuth();
    if (!session) {
        return <Redirect href="/(auth)/sign-in" />
    }

    if(!isAdmin){
        return <Redirect href={'/(user)'} />
    }

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

export default ProtectedLayout;
