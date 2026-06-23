import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useEffect } from 'react';
import { useFonts, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useTrackrStore } from '../src/store/trackrStore';
import { p23 } from '../src/constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Bold': DMSans_700Bold,
  });

  const { loadData, isLoaded } = useTrackrStore();

  useEffect(() => {
    loadData();
  }, []);

  if (!fontsLoaded || !isLoaded) {
    return <View style={{ flex: 1, backgroundColor: p23.void }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: p23.void }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
