import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface StatCellProps {
  value: string | number;
  label: string;
  color?: string;
}

export const StatCell = React.memo(function StatCell({ value, label, color = Colors.text }: StatCellProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  value: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.text3,
    letterSpacing: Typography.wider,
  },
});
