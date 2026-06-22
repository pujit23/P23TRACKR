import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, withTiming, Easing, useAnimatedProps,
} from 'react-native-reanimated';
import { C, T } from '../constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 120;
const R = 50;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface Props {
  percent: number;
  label?: string;
  color?: string;
}

export const RingProgress: React.FC<Props> = ({ percent, label, color = C.PINK }) => {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value / 100),
  }));

  useEffect(() => {
    progress.value = withTiming(percent, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent]);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          stroke={C.BORDER}
          strokeWidth={8}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          stroke={color}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.pct, { color }]}>{Math.round(percent)}%</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    alignItems: 'center', justifyContent: 'center',
  },
  pct: { ...T.HEADING, fontSize: 22, fontWeight: '700', letterSpacing: -1 },
  label: { ...T.CAPTION, color: C.MUTED, marginTop: 2 },
});
