import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category, Difficulty } from '../types';
import { C, S, T } from '../constants';

interface PillProps {
  cat: Category;
  size?: 'sm' | 'md';
}
export const CategoryPill: React.FC<PillProps> = ({ cat, size = 'md' }) => {
  const color = C.CAT[cat];
  const lightColor = C.CAT_L[cat];
  const bg = C.CAT_G[cat];
  const label = cat.charAt(0).toUpperCase() + cat.slice(1);
  const height = size === 'sm' ? 18 : 22;
  const fontSize = size === 'sm' ? 9 : 11;
  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: color + '55', height }]}>
      <Text style={[styles.text, { color: lightColor, fontSize }]}>{label}</Text>
    </View>
  );
};

interface DiffProps {
  diff: Difficulty;
  size?: 'sm' | 'md';
}
export const DifficultyBadge: React.FC<DiffProps> = ({ diff, size = 'md' }) => {
  const color = C.DIFF[diff];
  const label = diff.charAt(0).toUpperCase() + diff.slice(1);
  const height = size === 'sm' ? 18 : 22;
  const fontSize = size === 'sm' ? 9 : 11;
  return (
    <View style={[styles.pill, { backgroundColor: color + '20', borderColor: color + '55', height }]}>
      <Text style={[styles.text, { color, fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 9,
    borderRadius: S.R_PILL,
    borderWidth: S.BORDER,
    justifyContent: 'center', alignItems: 'center',
  },
  text: { ...T.MICRO, textTransform: 'capitalize' },
});
