import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { StatCell } from '../shared/StatCell';

interface StreakCardProps {
  streakCount: number;
  completedFraction: string;
  weeklyRate: string;
  dots: Array<'done' | 'today' | 'missed' | 'future'>;
}

export const StreakCard = React.memo(function StreakCard({ streakCount, completedFraction, weeklyRate, dots }: StreakCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.glow} />
      <View style={styles.header}>
        <Text style={styles.title}>CURRENT STREAK</Text>
        <View style={styles.pill}>
          <SymbolView name="flame.fill" size={12} tintColor={Colors.amber} />
          <Text style={styles.pillText}>ON FIRE</Text>
        </View>
      </View>

      <View style={styles.dotsRow}>
        {dots.map((status, index) => {
          let dotColor: string = Colors.borderMuted;
          if (status === 'done') dotColor = Colors.purple;
          if (status === 'today') dotColor = Colors.amber;
          if (status === 'missed') dotColor = Colors.border;
          return <View key={index} style={[styles.dot, { backgroundColor: dotColor }]} />;
        })}
      </View>

      <View style={styles.metrics}>
        <StatCell value={streakCount} label="DAYS" color={Colors.purple} />
        <StatCell value={completedFraction} label="TODAY" color={Colors.green} />
        <StatCell value={weeklyRate} label="THIS WEEK" color={Colors.text} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 18, // Intentional layout matching rule 7
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  glow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    backgroundColor: Colors.purple,
    opacity: 0.08,
    borderRadius: Radius.full,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.text3,
    letterSpacing: Typography.widest,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleGlow,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: Spacing.xs,
  },
  pillText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.purple,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 5, // Intentional configuration per layout spec
    marginBottom: Spacing.lg,
  },
  dot: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
