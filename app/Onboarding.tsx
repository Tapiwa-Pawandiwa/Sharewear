import { Stack } from "expo-router";
import React from "react";


export default function Onboarding() {
    return (
            <Stack>
                <Stack.Screen name="Onboarding" options={{headerShown:false}} />
            </Stack>
    );

}