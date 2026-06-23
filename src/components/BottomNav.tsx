import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { p23 } from '../constants/theme';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { name: 'dashboard', icon: 'home', path: '/(tabs)/dashboard' },
  { name: 'daily-log', icon: 'check-square', path: '/(tabs)/daily-log' },
  { name: 'badges', icon: 'award', path: '/(tabs)/badges' },
  { name: 'profile', icon: 'user', path: '/(tabs)/profile' }
];

export default function BottomNav() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {NAV_ITEMS.map(item => {
          const isActive = currentRoute === item.name || (currentRoute === '(tabs)' && item.name === 'dashboard');
          return (
            <Pressable key={item.name} onPress={() => router.push(item.path as any)} style={styles.navItem}>
              {isActive && <View style={styles.iconBgActive} />}
              <Feather name={item.icon as any} size={22} color={isActive ? p23.purple : 'rgba(255,255,255,0.4)'} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
    zIndex: 50,
  },
  navBar: {
    flexDirection: 'row',
    width: width - 32,
    maxWidth: 400,
    height: 72,
    backgroundColor: 'rgba(26,26,26,0.85)',
    borderRadius: 36,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(138,43,226,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 10,
  },
  navItem: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgActive: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: p23.purpleDim,
    shadowColor: p23.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  }
});
