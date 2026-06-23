import { Stack } from 'expo-router';
import BottomNav from '../../src/components/BottomNav';
import { View, StyleSheet } from 'react-native';
import { p23 } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: p23.void } }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="daily-log" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: p23.void,
  }
});
