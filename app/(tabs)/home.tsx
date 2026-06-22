import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useApp } from '../../context/AppContext';
import { C, S, T } from '../../constants';
import { AnimatedStatCard } from '../../components/AnimatedStatCard';
import { RingProgress } from '../../components/RingProgress';
import { GoalCard } from '../../components/GoalCard';
import { todayKey, formatDisplay } from '../../utils/dates';
import { getTodayCompletion, calculateStreak } from '../../utils/streak';
import { getRank } from '../../utils/xp';

const MOODS = ['😔', '😐', '🙂', '😊', '🤩'];

export default function HomeScreen() {
  const router = useRouter();
  const { state, saveLog } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const today = todayKey();
  const todayLog = state.logs.find(l => l.date === today);
  const activeGoals = state.goals.filter(g => !g.archived);
  
  const completionPct = getTodayCompletion(state);
  const completedCount = todayLog?.checks.filter(Boolean).length || 0;
  const rankInfo = getRank(state.xp);
  const totalLogs = state.logs.filter(l => l.checks.some(Boolean)).length;

  useEffect(() => {
    if (completionPct === 100 && activeGoals.length > 0) {
      // Check if we already showed confetti today (we can store this in state or just show once per mount if 100%)
      // For simplicity, just show it if we hit 100% and haven't shown it yet this session
      if (!showConfetti) {
        setShowConfetti(true);
      }
    } else {
      setShowConfetti(false);
    }
  }, [completionPct, activeGoals.length]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleMoodSelect = (moodIdx: number) => {
    const existingLog = state.logs.find(l => l.date === today);
    saveLog({
      date: today,
      checks: existingLog?.checks || new Array(state.goals.length).fill(false),
      goalNotes: existingLog?.goalNotes || new Array(state.goals.length).fill(''),
      note: existingLog?.note || '',
      mood: (moodIdx + 1) as any,
      energy: existingLog?.energy || 3,
    });
  };

  const handleGoalCheck = (idx: number) => {
    const existingLog = state.logs.find(l => l.date === today);
    const checks = [...(existingLog?.checks || new Array(state.goals.length).fill(false))];
    checks[idx] = !checks[idx];
    
    saveLog({
      date: today,
      checks,
      goalNotes: existingLog?.goalNotes || new Array(state.goals.length).fill(''),
      note: existingLog?.note || '',
      mood: existingLog?.mood || 3,
      energy: existingLog?.energy || 3,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>P23TRACK</Text>
        <Text style={styles.dateText}>{formatDisplay(today)}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Feather name="bell" size={20} color={C.TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.PINK} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingBlock}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Hey, {state.name} 👋</Text>
            <Text style={styles.greetingSub}>Let's make today count.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.rankBadge}>
            <Text style={styles.rankEmoji}>⭐</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsStrip}>
          <AnimatedStatCard label="Streak" value={calculateStreak(state)} color={C.PINK} emoji="🔥" delay={100} />
          <AnimatedStatCard label="Today %" value={completionPct} color={C.BLUE} suffix="%" emoji="✅" delay={200} />
          <AnimatedStatCard label="Total Logs" value={totalLogs} emoji="📅" delay={300} />
          <AnimatedStatCard label="XP" value={state.xp} color={C.AMBER} emoji="⭐" delay={400} />
          <AnimatedStatCard label="Best Streak" value={state.bestStreak} color={C.TEAL} emoji="🏆" delay={500} />
        </ScrollView>

        <View style={styles.ringCard}>
          <RingProgress percent={completionPct} color={completionPct === 100 ? C.AMBER : C.PINK} />
          <Text style={styles.ringText}>{completedCount} of {activeGoals.length} goals done today</Text>
          {completionPct === 100 && activeGoals.length > 0 && (
            <Text style={styles.perfectText}>🎉 Perfect day!</Text>
          )}
          {showConfetti && (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <ConfettiCannon count={50} origin={{x: -10, y: 0}} fallSpeed={2500} fadeOut />
            </View>
          )}
        </View>

        <View style={styles.moodCard}>
          <Text style={styles.sectionHeader}>HOW ARE YOU FEELING?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.moodBtn, todayLog?.mood === i + 1 && styles.moodBtnActive]}
                onPress={() => handleMoodSelect(i)}
              >
                <Text style={{ fontSize: 24 }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {todayLog?.mood && <Text style={styles.updatedText}>updated ✓</Text>}
        </View>

        <View style={styles.goalsSectionHeader}>
          <Text style={styles.sectionHeaderTitle}>TODAY'S GOALS</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/log')}>
            <Text style={styles.linkText}>log all →</Text>
          </TouchableOpacity>
        </View>

        {activeGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptySub}>Add your first goal to start tracking.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/goals')}>
              <Text style={styles.emptyBtnText}>Add a goal →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activeGoals.map((g, i) => (
            <Animated.View key={g.id} entering={FadeInDown.delay(i * 60)}>
              <GoalCard 
                goal={g} 
                checked={todayLog?.checks[i] || false}
                index={i}
                onPress={() => handleGoalCheck(i)}
              />
            </Animated.View>
          ))
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.BG },
  topBar: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: S.SCREEN_H, paddingVertical: 12 
  },
  logoText: { ...T.LABEL, color: C.PINK, fontWeight: '700' },
  dateText: { ...T.CAPTION, color: C.MUTED },
  scrollContent: { paddingHorizontal: S.SCREEN_H, paddingBottom: 20 },
  greetingBlock: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 24 },
  greetingTitle: { ...T.TITLE, color: C.TEXT },
  greetingSub: { ...T.BODY, color: C.MUTED },
  rankBadge: { 
    width: 48, height: 48, borderRadius: 24, 
    borderWidth: 2, borderColor: C.AMBER, 
    justifyContent: 'center', alignItems: 'center' 
  },
  rankEmoji: { fontSize: 20 },
  statsStrip: { gap: 10, paddingBottom: 20 },
  ringCard: { 
    backgroundColor: C.CARD, borderRadius: S.R_LG, borderWidth: S.BORDER, borderColor: C.BORDER,
    padding: 20, alignItems: 'center', marginBottom: 16, overflow: 'hidden'
  },
  ringText: { ...T.BODY, color: C.TEXT, marginTop: 16 },
  perfectText: { ...T.LABEL, color: C.AMBER, marginTop: 8 },
  moodCard: {
    backgroundColor: C.CARD, borderRadius: S.R_LG, borderWidth: S.BORDER, borderColor: C.BORDER,
    padding: 16, marginBottom: 24
  },
  sectionHeader: { ...T.MICRO, color: C.MUTED, marginBottom: 12 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: C.SURFACE,
    justifyContent: 'center', alignItems: 'center',
  },
  moodBtnActive: { backgroundColor: C.PINK_G, borderWidth: 1.5, borderColor: C.PINK },
  updatedText: { ...T.CAPTION, color: C.TEAL, textAlign: 'right', marginTop: 8 },
  goalsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeaderTitle: { ...T.LABEL, color: C.TEXT, letterSpacing: 1 },
  linkText: { ...T.LABEL, color: C.PINK },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { ...T.HEADING, color: C.TEXT },
  emptySub: { ...T.BODY, color: C.MUTED, marginTop: 4, marginBottom: 20 },
  emptyBtn: { borderWidth: 1, borderColor: C.PINK, paddingHorizontal: 20, paddingVertical: 10, borderRadius: S.R_MD },
  emptyBtnText: { ...T.LABEL, color: C.PINK },
});
