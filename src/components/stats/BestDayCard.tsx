import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Radius } from '../../constants/theme';

interface BestDayCardProps {
  dayName: string;
  completionsCount: number;
}

export const BestDayCard = React.memo(function BestDayCard({ dayName, completionsCount }: BestDayCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <SymbolView name="trophy.fill" size={24} tintColor={Colors.green} />
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>Best day: {dayName}</Text>
        <Text style={styles.subtitle}>All {completionsCount} habits completed</Text>
      </View>
      <Text style={styles.right}>{completionsCount}/{completionsCount}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    backgroundColor: Colors.greenDim,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.text3,
  },
  right: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.green,
  },
});
