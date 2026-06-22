import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Radius, Typography } from '../../constants/theme';

interface StatGridProps {
  completionRate: string;
  streak: number;
  habitsDone: number;
  possible: number;
}

export const StatGrid = React.memo(function StatGrid({ completionRate, streak, habitsDone, possible }: StatGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={[styles.val, { color: Colors.purple }]}>{completionRate}</Text>
        <Text style={styles.lbl}>COMPLETION</Text>
      </View>
      <View style={styles.cell}>
        <Text style={[styles.val, { color: Colors.green }]}>{streak}</Text>
        <Text style={styles.lbl}>STREAK</Text>
      </View>
      <View style={styles.cell}>
        <Text style={[styles.val, { color: Colors.amber }]}>{habitsDone}</Text>
        <Text style={styles.lbl}>HABITS DONE</Text>
      </View>
      <View style={styles.cell}>
        <Text style={[styles.val, { color: Colors.text }]}>{possible}</Text>
        <Text style={styles.lbl}>POSSIBLE</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: '48%', // Matches 2x2 specification layout requirement
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: 16,
  },
  val: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
  },
  lbl: {
    fontSize: Typography.xs,
    color: Colors.text3,
    fontWeight: Typography.semibold,
    marginTop: 4,
    letterSpacing: Typography.wide,
  },
});
