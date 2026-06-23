import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G, Line } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, withRepeat, useAnimatedStyle, withDelay } from 'react-native-reanimated';
import { p23 } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GoalRingProps {
  percentage: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export default function GoalRing({ percentage, size = 220, label, sublabel }: GoalRingProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = radius * 2 * Math.PI;
  
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    progress.value = withDelay(200, withTiming(percentage / 100, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    pulse.value = withRepeat(withTiming(1.1, { duration: 1500 }), -1, true);
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - progress.value * circumference,
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: 0.5 - (pulse.value - 1)
    };
  });

  const center = size / 2;

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6) * (Math.PI / 180);
      const isMajor = i % 5 === 0;
      const innerRad = radius - (isMajor ? 8 : 4);
      const outerRad = radius + (isMajor ? 8 : 4);
      
      const x1 = center + innerRad * Math.sin(angle);
      const y1 = center - innerRad * Math.cos(angle);
      const x2 = center + outerRad * Math.sin(angle);
      const y2 = center - outerRad * Math.cos(angle);
      
      ticks.push(
        <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMajor ? p23.purpleDim : 'rgba(255,255,255,0.08)'} strokeWidth={isMajor ? 2 : 1} />
      );
    }
    return ticks;
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', width: size - 40, height: size - 40, borderRadius: size / 2, backgroundColor: p23.purpleDim }, pulseStyle]} />
      
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={p23.gradients.progress[0]} />
            <Stop offset="1" stopColor={p23.gradients.progress[1]} />
          </LinearGradient>
        </Defs>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {renderTicks()}
          <Circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} fill="none" />
          <AnimatedCircle
            cx={center} cy={center} r={radius}
            stroke="url(#grad)" strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 44, fontWeight: 'bold', color: p23.text }}>
          {Math.round(percentage)}%
        </Text>
        {label && <Text style={{ color: p23.purple, fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>{label}</Text>}
        {sublabel && <Text style={{ color: p23.muted, fontSize: 12 }}>{sublabel}</Text>}
      </View>
    </View>
  );
}
