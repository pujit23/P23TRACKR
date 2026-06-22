import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { ProgressBar } from '../shared/ProgressBar';

interface XPProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

export const XPProgressBar = React.memo(function XPProgressBar({ currentXP, nextLevelXP, progress }: XPProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.xpText}>{currentXP.toLocaleString()} XP</Text>
        <Text style={styles.nextText}>Next: {nextLevelXP.toLocaleString()} XP</Text>
      </View>
      <ProgressBar progress={progress} color={Colors.purple} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  xpText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.purple,
  },
  nextText: {
    fontSize: Typography.sm,
    color: Colors.text3,
  },
});
