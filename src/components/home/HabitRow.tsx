import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import { Colors, Typography, Radius } from '../../constants/theme';
import { Habit } from '../../context/types';
import { HabitIcon } from '../shared/HabitIcon';
import { ProgressBar } from '../shared/ProgressBar';

interface HabitRowProps {
  habit: Habit;
  isComplete: boolean;
  progress: number; // 0 to 1
  onToggle: () => void;
  onPress: () => void;
}

export const HabitRow = React.memo(function HabitRow({ habit, isComplete, progress, onToggle, onPress }: HabitRowProps) {
  const rowScale = useSharedValue(1);
  const checkScale = useSharedValue(1);
  const completionProgress = useSharedValue(isComplete ? 1 : 0);

  useEffect(() => {
    completionProgress.value = withTiming(isComplete ? 1 : 0, { duration: 150 });
  }, [isComplete, completionProgress]);

  const handlePressIn = useCallback(() => {
    rowScale.value = withSpring(0.98, { damping: 12, stiffness: 300 });
  }, [rowScale]);

  const handlePressOut = useCallback(() => {
    rowScale.value = withSpring(1.0, { damping: 14, stiffness: 220 });
  }, [rowScale]);

  const handleCheckPress = useCallback(() => {
    checkScale.value = withTiming(0.75, { duration: 50 }, () => {
      checkScale.value = withSpring(1.15, { damping: 8 }, () => {
        checkScale.value = withTiming(1.0, { duration: 80 });
      });
    });
    onToggle();
  }, [onToggle, checkScale]);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  const animatedCheckStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['transparent', Colors.purple]
    );
    return {
      transform: [{ scale: checkScale.value }],
      backgroundColor: bgColor,
    };
  });

  const categoryColor = Colors[habit.category] || Colors.purple;

  return (
    <Animated.View style={[styles.container, animatedRowStyle]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressableArea}>
        <HabitIcon symbol={habit.symbol} category={habit.category} size={28} />
        
        <View style={styles.info}>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.subLabel}>
            {habit.targetType === 'numeric' ? `${habit.targetValue} ${habit.targetUnit}` : habit.category}
          </Text>
          {habit.targetType === 'numeric' && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} color={categoryColor} />
            </View>
          )}
        </View>
      </Pressable>

      {habit.targetType === 'numeric' && progress < 1 ? (
        <Text style={[styles.progressText, { color: categoryColor }]}>
          {Math.round(progress * 100)}%
        </Text>
      ) : (
        <Pressable onPress={handleCheckPress} style={styles.checkWrapper}>
          <Animated.View style={[styles.circle, isComplete ? styles.circleComplete : styles.circleIncomplete, animatedCheckStyle]}>
            {isComplete && <SymbolView name="checkmark" size={16} tintColor="#FFFFFF" weight="semibold" />}
          </Animated.View>
        </Pressable>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressableArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  subLabel: {
    fontSize: Typography.sm,
    color: Colors.text3,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 6,
  },
  progressText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  checkWrapper: {
    padding: 4,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIncomplete: {
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  circleComplete: {
    borderWidth: 0,
  },
});
