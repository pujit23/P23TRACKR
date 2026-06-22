import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Radius } from '../../constants/theme';
import { Habit } from '../../context/types';

interface HabitBreakdownRowProps {
  habit: Habit;
  fraction: string;
  progress: number; // 0 to 1
}

export const HabitBreakdownRow = React.memo(function HabitBreakdownRow({ habit, fraction, progress }: HabitBreakdownRowProps) {
  const categoryColor = Colors[habit.category] || Colors.purple;

  return (
    <View style={styles.row}>
      <SymbolView name={habit.symbol as any} size={20} tintColor={categoryColor} />
      <Text style={styles.name}>{habit.name}</Text>
      <Text style={[styles.fraction, { color: categoryColor }]}>{fraction}</Text>
      <View style={styles.miniBarTrack}>
        <View style={[styles.miniBarFill, { width: 80 * progress, backgroundColor: categoryColor }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderMuted,
  },
  name: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: Typography.medium,
  },
  fraction: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  miniBarTrack: {
    width: 80, // Static micro layout bar requirement
    height: 4,
    backgroundColor: Colors.borderMuted,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
