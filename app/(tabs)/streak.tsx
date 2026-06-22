import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, withTiming, withRepeat, withSequence, useAnimatedStyle, FadeIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../../context/AppContext';
import { C, S, T } from '../../constants';
import { calculateStreak } from '../../utils/streak';
import { BADGE_DEFS } from '../../utils/badges';
import { todayKey, previousDay } from '../../utils/dates';

export default function StreakScreen() {
  const { state } = useApp();
  const streak = calculateStreak(state);

  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(1);

  React.useEffect(() => {
    flameScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 800 }), withTiming(0.95, { duration: 800 })),
      -1,
      true
    );
    flameOpacity.value = withRepeat(
      withSequence(withTiming(0.8, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      true
    );
  }, []);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  const getDayStatus = (dateStr: string) => {
    const log = state.logs.find(l => l.date === dateStr);
    if (log && log.checks.some(Boolean)) return 'completed';
    if (state.streakFreezeUsedDates.includes(dateStr)) return 'frozen';
    if (dateStr === todayKey() && !log?.checks.some(Boolean)) return 'today';
    if (dateStr > todayKey()) return 'future';
    return 'missed';
  };

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      days.push({ key: k, letter: ['S','M','T','W','T','F','S'][i], num: d.getDate(), status: getDayStatus(k) });
    }
    return days;
  };

  const getLast30Days = () => {
    const days = [];
    let d = todayKey();
    for (let i = 0; i < 35; i++) {
      days.unshift(d);
      d = previousDay(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const heatMapDays = getLast30Days();

  const getHeatmapColor = (dateStr: string) => {
    const status = getDayStatus(dateStr);
    if (status === 'completed') {
      const log = state.logs.find(l => l.date === dateStr);
      const activeCount = state.goals.filter(g => !g.archived).length;
      if (!log || activeCount === 0) return C.PINK + '40'; // 25% opacity
      const pct = log.checks.filter(Boolean).length / activeCount;
      if (pct === 1) return C.PINK;
      if (pct > 0.6) return C.PINK + 'CC'; // 80% opacity
      if (pct > 0.3) return C.PINK + '8C'; // 55% opacity
      return C.PINK + '40'; // 25% opacity
    }
    return C.BORDER;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Streak Hero */}
        <View style={styles.hero}>
          <Animated.View style={flameStyle}>
            <Svg width="60" height="80" viewBox="0 0 24 24" fill="none" stroke={C.PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Path fill={C.PINK} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </Svg>
          </Animated.View>
          <Animated.Text entering={FadeIn.duration(900)} style={styles.heroNumber}>{streak}</Animated.Text>
          <Text style={styles.heroText}>day streak</Text>
          {streak === 0 && <Text style={styles.heroSubText}>Start your streak today!</Text>}
        </View>

        {/* Streak Freezes */}
        <View style={styles.freezeRow}>
          <View style={styles.freezeIcons}>
            {[...Array(3)].map((_, i) => (
              <Text key={i} style={{ fontSize: 20, opacity: i < state.streakFreezes ? 1 : 0.3 }}>❄️</Text>
            ))}
          </View>
          <View>
            <Text style={styles.freezeLabel}>{state.streakFreezes} streak freeze(s) remaining</Text>
            {state.streakFreezes === 0 && <Text style={styles.freezeSub}>Hit a 7-day streak to earn more</Text>}
          </View>
        </View>

        {/* This Week Grid */}
        <View style={styles.weekGrid}>
          {weekDays.map(d => (
            <View key={d.key} style={[
              styles.weekCell,
              d.status === 'completed' && { backgroundColor: C.PINK, borderColor: C.PINK },
              d.status === 'today' && { borderColor: C.PINK, borderStyle: 'dashed', borderWidth: 1.5 },
              d.status === 'frozen' && { backgroundColor: C.BLUE_G, borderColor: C.BLUE },
            ]}>
              <Text style={[styles.weekLetter, d.status === 'completed' && { color: '#fff' }]}>{d.letter}</Text>
              <Text style={[styles.weekNum, d.status === 'completed' && { color: '#fff' }]}>{d.num}</Text>
              {d.status === 'frozen' && <Text style={styles.frozenIcon}>❄️</Text>}
            </View>
          ))}
        </View>

        {/* 30 Day Heatmap */}
        <View style={styles.heatmapCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Last 30 days</Text>
            <Text style={styles.sectionSubtitle}>Activity</Text>
          </View>
          <View style={styles.heatmapGrid}>
            {heatMapDays.map(d => (
              <View key={d} style={[styles.heatmapDot, { backgroundColor: getHeatmapColor(d) }]} />
            ))}
          </View>
        </View>

        {/* Badges */}
        <Text style={[styles.sectionTitle, { marginBottom: 12, marginTop: 8 }]}>BADGES EARNED</Text>
        {Object.keys(BADGE_DEFS).length > 0 ? (
          <View style={styles.badgeGrid}>
            {Object.entries(BADGE_DEFS).map(([id, def]) => {
              const earned = state.badges.includes(id);
              return (
                <TouchableOpacity key={id} style={[styles.badgeCard, earned && styles.badgeCardEarned]} activeOpacity={0.8}>
                  {!earned && <View style={styles.lockOverlay}><Feather name="lock" size={12} color={C.DIM} /></View>}
                  <Text style={[styles.badgeIcon, !earned && { opacity: 0.3 }]}>{def.icon}</Text>
                  <Text style={[styles.badgeName, earned ? { color: C.PINK_L } : { color: C.DIM }]}>{def.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
           <View style={styles.emptyState}>
             <Text style={{ fontSize: 40, marginBottom: 12 }}>🏆</Text>
             <Text style={{ ...T.HEADING, color: C.TEXT }}>No badges yet</Text>
             <Text style={{ ...T.BODY, color: C.MUTED, marginTop: 4 }}>Complete milestones to unlock badges.</Text>
           </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.BG },
  scrollContent: { paddingHorizontal: S.SCREEN_H, paddingVertical: S.SCREEN_V },
  hero: { alignItems: 'center', paddingVertical: 32 },
  heroNumber: { ...T.HERO, fontSize: 56, color: C.PINK, marginTop: 8 },
  heroText: { ...T.HEADING, color: C.MUTED },
  heroSubText: { ...T.BODY, color: C.DIM, marginTop: 4 },
  freezeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.SURFACE, padding: 16, borderRadius: S.R_LG, marginBottom: 24, borderWidth: 1, borderColor: C.BORDER },
  freezeIcons: { flexDirection: 'row', gap: 4, marginRight: 16 },
  freezeLabel: { ...T.LABEL, color: C.TEXT },
  freezeSub: { ...T.CAPTION, color: C.DIM, marginTop: 2 },
  weekGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  weekCell: { 
    width: 44, height: 52, borderRadius: S.R_SM, backgroundColor: C.CARD, 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.BORDER 
  },
  weekLetter: { ...T.MICRO, color: C.MUTED, marginBottom: 2 },
  weekNum: { ...T.LABEL, color: C.TEXT },
  frozenIcon: { position: 'absolute', top: -5, right: -5, fontSize: 10 },
  heatmapCard: { backgroundColor: C.CARD, borderRadius: S.R_LG, borderWidth: 1, borderColor: C.BORDER, padding: 16, marginBottom: 32 },
  sectionTitle: { ...T.LABEL, color: C.TEXT, textTransform: 'uppercase', letterSpacing: 1 },
  sectionSubtitle: { ...T.CAPTION, color: C.MUTED },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-start' },
  heatmapDot: { width: 10, height: 10, borderRadius: 2 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeCard: { 
    width: '31%', aspectRatio: 1, backgroundColor: C.SURFACE, borderRadius: S.R_MD, 
    borderWidth: 1, borderColor: C.BORDER, justifyContent: 'center', alignItems: 'center',
    position: 'relative', padding: 8
  },
  badgeCardEarned: { backgroundColor: C.PINK_G, borderColor: C.PINK },
  badgeIcon: { fontSize: 24, marginBottom: 8 },
  badgeName: { ...T.MICRO, textAlign: 'center' },
  lockOverlay: { position: 'absolute', top: 6, right: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
});
