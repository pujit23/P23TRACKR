import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Animated, {
  useSharedValue, withTiming, useAnimatedProps, Easing,
} from 'react-native-reanimated';
import { C, S, T } from '../constants';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
  prefix?: string;
  emoji?: string;
  delay?: number;
}

export const AnimatedStatCard: React.FC<Props> = ({
  label, value, color = C.TEXT, suffix = '', prefix = '', emoji = '', delay = 0,
}) => {
  const animVal = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      animVal.value = withTiming(value, { duration: 900, easing: Easing.out(Easing.cubic) });
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${prefix}${Math.round(animVal.value)}${suffix}`,
    } as any;
  });

  return (
    <View style={styles.card}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <AnimatedTextInput 
        underlineColorAndroid="transparent"
        editable={false}
        value={`${prefix}0${suffix}`}
        style={[styles.value, { color }]}
        animatedProps={animatedProps}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.CARD,
    borderRadius: S.R_MD,
    borderWidth: S.BORDER,
    borderColor: C.BORDER,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 72,
  },
  emoji: { fontSize: 16, marginBottom: 4 },
  value: { ...T.HERO, fontSize: 28, letterSpacing: -1.5, textAlign: 'center', padding: 0 },
  label: { ...T.MICRO, color: C.MUTED, marginTop: 4, textTransform: 'uppercase' },
});
