import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Goal } from '../types';
import { C, S, T } from '../constants';
import { CategoryPill, DifficultyBadge } from './GoalCategoryPill';
import { AnimatedProgressBar } from './AnimatedProgressBar';

interface Props {
  goal: Goal;
  checked: boolean;
  completionRate?: number;  // 0–100 for display in Goals screen
  onPress?: () => void;
  onLongPress?: () => void;
  showStats?: boolean;
  index?: number;
}

export const GoalCard: React.FC<Props> = ({
  goal, checked, completionRate, onPress, onLongPress, showStats, index = 0,
}) => {
  const accent = C.CAT[goal.cat];

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.85}
      style={[styles.card, checked && styles.cardDone]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.name, checked && styles.nameDone]} numberOfLines={1}>
            {goal.name}
          </Text>
          <View style={styles.badges}>
            <CategoryPill cat={goal.cat} size="sm" />
            <DifficultyBadge diff={goal.difficulty} size="sm" />
          </View>
        </View>

        <AnimatedProgressBar
          percent={checked ? 100 : 0}
          color={accent}
          height={3}
          delay={index * 80}
        />

        <View style={styles.bottomRow}>
          <Text style={[styles.status, checked && styles.statusDone]}>
            {checked ? '✓  done today' : 'not logged yet'}
          </Text>
          {showStats && completionRate !== undefined && (
            <Text style={styles.rate}>{completionRate}% completion</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: C.CARD,
    borderRadius: S.R_LG,
    borderWidth: S.BORDER,
    borderColor: C.BORDER,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardDone: { opacity: 0.75 },
  accent: { width: 3 },
  body: { flex: 1, padding: S.CARD_H, paddingVertical: S.CARD_V },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  name: { ...T.LABEL, color: C.TEXT, flex: 1, marginRight: 8 },
  nameDone: { textDecorationLine: 'line-through', color: C.MUTED },
  badges: { flexDirection: 'row', gap: 5 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  status: { ...T.CAPTION, color: C.MUTED },
  statusDone: { color: C.TEAL },
  rate: { ...T.CAPTION, color: C.DIM },
});
