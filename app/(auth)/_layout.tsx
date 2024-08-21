import { useAuth } from "../providers/Auth";
import { Redirect, Stack, useRouter } from 'expo-router';

export default function AuthLayout() {
    const { session, loading, profile } = useAuth();
    if(session){
        return <Redirect href={'/'} />
    }




    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        </Stack>
    )
}