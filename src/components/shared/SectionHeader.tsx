import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader = React.memo(function SectionHeader({ title, actionText, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {actionText && onActionPress && (
        <Pressable onPress={onActionPress}>
          <Text style={styles.action}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.text3,
    letterSpacing: Typography.widest,
  },
  action: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.purple,
  },
});
