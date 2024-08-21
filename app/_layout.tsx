import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import AuthProvider, { useAuth } from './providers/Auth';
import { FormProvider } from './providers/Form';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import { QueryClient, QueryClientProvider } from 'react-query';





export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'onboarding',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

 function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Now-Regular": require("../assets/fonts/Now-Regular.otf"),
    "Now-Bold": require("../assets/fonts/Now-Bold.otf"),
    "Now-Light": require("../assets/fonts/Now-Light.otf"),
    "Now-Medium": require("../assets/fonts/Now-Medium.otf"),
    "Now-Black": require("../assets/fonts/Now-Black.otf"),
    "SFPro-Regular": require("../assets/fonts/SFPro-Regular.ttf"),
    "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
    "LeagueSpartan-Thin": require("../assets/fonts/LeagueSpartan-Thin.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
/*
<Stack.Screen name="index" options={{ headerShown: false }} />

*/




function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { loginWithToken } = useAuth();
global.Buffer = global.Buffer || require('buffer').Buffer;
useEffect(() => {
  const handleDeepLink = async (event:any) => {
    const url = event.url;
    const accessToken = url.split('access_token=')[1]?.split('&')[0];
    const refreshToken = url.split('refresh_token=')[1]?.split('&')[0];

    if (accessToken && refreshToken) {
      // Call loginWithToken to set the session
      try {
        await loginWithToken({ access_token: accessToken, refresh_token: refreshToken });
        router.push('/reset-password');
      } catch (error) {
        console.error('Failed to log in with token:', error);
      }
    }
  };

  Linking.addEventListener('url', handleDeepLink);

  // Check if the app was opened from a deep link on launch
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
  });

  
}, []);

const queryClient = new QueryClient();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
     <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <FormProvider>
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
     </Stack>
     </FormProvider>
      </QueryClientProvider>
     </AuthProvider>
    </ThemeProvider>
 
  );
}


export default RootLayout;