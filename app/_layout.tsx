import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '../src/context/AppContext';
import { AppProvider as RootAppProvider } from '../context/AppContext';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootAppProvider>
        <AppProvider>
          <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <StatusBar style="light" backgroundColor={Colors.bg as any} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </AppProvider>
      </RootAppProvider>
    </GestureHandlerRootView>
  );
}
