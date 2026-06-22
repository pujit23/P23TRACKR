import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { C, T } from '../constants';

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useApp();
  
  const lineWidth = useSharedValue(0);

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  useEffect(() => {
    lineWidth.value = withDelay(600, withTiming(40, { duration: 500 }));

    const timer = setTimeout(() => {
      if (!state.setup) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/home');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [state.setup]);

  return (
    <View style={styles.container}>
      <Animated.Text 
        entering={FadeIn.duration(600)} 
        style={styles.logo}
      >
        P23TRACK
      </Animated.Text>
      
      <Animated.Text 
        entering={FadeIn.delay(300).duration(800)} 
        style={styles.tagline}
      >
        track what matters. every single day.
      </Animated.Text>

      <View style={styles.lineContainer}>
        <Animated.View style={[styles.line, lineStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    ...T.HERO,
    fontSize: 48,
    fontWeight: '800',
    color: C.PINK,
    letterSpacing: -3,
  },
  tagline: {
    ...T.LABEL,
    color: C.MUTED,
    marginTop: 8,
  },
  lineContainer: {
    height: 1,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: C.PINK,
    opacity: 0.3,
  },
});
