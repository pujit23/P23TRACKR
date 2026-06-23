import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing, withDelay } from 'react-native-reanimated';
import { p23 } from '../constants/theme';

interface XPSplashProps {
  show: boolean;
  amount: number;
  onDone: () => void;
}

export default function XPSplash({ show, amount, onDone }: XPSplashProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (show) {
      opacity.value = withSequence(
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
        withDelay(500, withTiming(0, { duration: 200 }))
      );
      translateY.value = withTiming(-100, { duration: 900, easing: Easing.out(Easing.cubic) });
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );

      const timeout = setTimeout(() => {
        onDone();
        // reset
        translateY.value = 0;
        scale.value = 0.5;
      }, 900);

      return () => clearTimeout(timeout);
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });

  if (!show) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.text}>+{amount} XP</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill as any,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 64,
    fontWeight: 'bold',
    color: p23.purple,
    textShadowColor: p23.purpleGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  }
});
