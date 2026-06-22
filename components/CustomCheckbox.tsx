import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { C, S } from '../constants';

interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
  hapticsEnabled?: boolean;
}

export const CustomCheckbox: React.FC<Props> = ({ checked, onChange, hapticsEnabled = true }) => {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const toggle = () => {
    scale.value = withSpring(0.8, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(!checked);
  };

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
      <Animated.View style={[styles.box, checked && styles.checked, anim]}>
        {checked && <Feather name="check" size={13} color="#fff" strokeWidth={3} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 22, height: 22,
    borderRadius: S.R_SM,
    borderWidth: S.BORDER_EMP,
    borderColor: C.BORDER_ACT,
    backgroundColor: C.SURFACE,
    alignItems: 'center', justifyContent: 'center',
  },
  checked: {
    backgroundColor: C.PINK,
    borderWidth: 0,
  },
});
