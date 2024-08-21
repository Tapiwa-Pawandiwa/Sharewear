import { Slot } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {Stack} from "expo-router";
import { useAuth } from "../providers/Auth";
import { Redirect } from "expo-router";
import React from "react";
import { useColorScheme } from '@/components/useColorScheme';

 function ProtectedLayout () {
    const colorScheme = useColorScheme();
    const {session, profile, isAdmin,loading} = useAuth();
    if (!session) {
        return <Redirect href="/(auth)" />
    }
    if (isAdmin && profile?.user_type=='Beneficiary') {
        return <Redirect href="/(admin)" />
    }
    return (
         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
    );
}

export default ProtectedLayout;
