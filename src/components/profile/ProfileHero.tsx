import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Radius, Spacing } from '../../constants/theme';

interface ProfileHeroProps {
  level: number;
  label: string;
}

export const ProfileHero = React.memo(function ProfileHero({ level, label }: ProfileHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>ME</Text>
      </View>
      <Text style={styles.name}>User</Text>
      <View style={styles.pill}>
        <SymbolView name="star.fill" size={12} tintColor={Colors.purple} />
        <Text style={styles.pillText}>Level {level} · {label}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.purpleDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.borderStrong,
  },
  avatarText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  name: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginTop: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleGlow,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    marginTop: 8,
  },
  pillText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.purple,
  },
});
