import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { p23 } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          borderRadius: 36,
          height: 72,
          backgroundColor: 'rgba(26,26,26,0.92)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(138,43,226,0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.6,
          shadowRadius: 40,
          elevation: 10,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: p23.purple,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: p23.void },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} /> }} />
      <Tabs.Screen name="daily-log" options={{ tabBarIcon: ({ color }) => <Feather name="check-square" size={22} color={color} /> }} />
      <Tabs.Screen name="badges" options={{ tabBarIcon: ({ color }) => <Feather name="award" size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} /> }} />
    </Tabs>
  );
}
