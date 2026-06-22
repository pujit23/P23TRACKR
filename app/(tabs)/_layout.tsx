import { Tabs } from 'expo-router';
import CustomTabBar from '../../src/components/layout/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index"   options={{ title: 'Today'   }} />
      <Tabs.Screen name="stats"   options={{ title: 'Stats'   }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
