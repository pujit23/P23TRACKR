import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors, Radius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // Value between 0 and 1
  color: string;
}

export const ProgressBar = React.memo(function ProgressBar({ progress, color }: ProgressBarProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
  }, [progress, animatedWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value * 100}%`,
    };
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, animatedStyle]} />
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    height: 3, // Intentional pixel size per specification
    backgroundColor: Colors.borderMuted,
    borderRadius: Radius.full,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
