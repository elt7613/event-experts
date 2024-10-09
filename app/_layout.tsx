import { APIProvider } from '@/api/ApiProvider';
import { AuthProvider } from '@/context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)/sign-in',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    MontserratLight: require('../assets/fonts/MontserratLight.ttf'),
    MontserratMedium: require('../assets/fonts/MontserratMedium.ttf'),
    MontserratSemiBold: require('../assets/fonts/MontserratSemiBold.ttf'),
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

function RootLayoutNav() {
  return (
    <APIProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            gestureDirection: 'horizontal',
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="notification" options={{ headerShown: false }} />
          <Stack.Screen name="addDetail" options={{ headerShown: false }} />
          <Stack.Screen name="addItem" options={{ headerShown: false }} />
          <Stack.Screen name="drawer" options={{ headerShown: false }} />
          <Stack.Screen name="editEvent" options={{ headerShown: false }} />
          <Stack.Screen name="editItem" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </APIProvider>
  );
}
