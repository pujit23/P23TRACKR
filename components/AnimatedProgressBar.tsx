import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { C, S } from '../constants';

interface Props {
  percent: number;   // 0–100
  color?: string;
  height?: number;
  delay?: number;
}

export const AnimatedProgressBar: React.FC<Props> = ({
  percent, color = C.PINK, height = 4, delay = 0,
}) => {
  const width = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({ width: `${width.value}%` as any }));

  useEffect(() => {
    const t = setTimeout(() => {
      width.value = withTiming(percent, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color, height, borderRadius: height }, anim]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { backgroundColor: C.BORDER, overflow: 'hidden' },
  fill: {},
});
