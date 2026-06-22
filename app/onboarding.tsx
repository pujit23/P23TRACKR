import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { requestNotificationPermissions } from '../hooks/useNotifications';
import { useApp } from '../context/AppContext';
import { C, S, T } from '../constants';
import { Goal, Category, Difficulty, Frequency } from '../types';

const AVATARS = ['🚀', '🎯', '💪', '📚', '🏃', '🧠', '💡', '⚡', '🔥'];
const FOCUSES: { id: Category | 'all'; label: string; color: string }[] = [
  { id: 'career', label: 'Career', color: C.BLUE },
  { id: 'fitness', label: 'Fitness', color: C.PINK },
  { id: 'life', label: 'Life', color: C.TEAL },
  { id: 'all', label: 'All', color: C.BORDER_ACT },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { dispatch, state } = useApp();
  const [step, setStep] = useState(0);

  // Step 1 State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState('🚀');
  const [focus, setFocus] = useState<Category | 'all'>('all');

  // Step 2 State
  const [goals, setGoals] = useState<Partial<Goal>[]>([
    { id: Math.random().toString(36).substring(2, 15), name: '', cat: 'fitness', difficulty: 'medium', frequency: 'daily', customDays: [] },
    { id: Math.random().toString(36).substring(2, 15), name: '', cat: 'career', difficulty: 'medium', frequency: 'daily', customDays: [] },
    { id: Math.random().toString(36).substring(2, 15), name: '', cat: 'life', difficulty: 'medium', frequency: 'daily', customDays: [] },
  ]);

  // Step 3 State
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  // Animation
  const translateX = useSharedValue(0);

  const nextStep = () => {
    if (step === 0) {
      if (name.length < 2 || !age) {
        if (state.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    } else if (step === 1) {
      const validGoals = goals.filter(g => g.name?.trim().length! > 0);
      if (validGoals.length === 0) {
        if (state.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }

    if (state.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(s => s + 1);
    translateX.value = withSpring(-(step + 1) * 100, { damping: 18 });
  };

  const finish = async () => {
    setSaving(true);
    
    if (reminderEnabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        setReminderEnabled(false);
      }
    }

    const finalGoals: Goal[] = goals
      .filter(g => g.name?.trim().length! > 0)
      .map((g, i) => ({
        ...g,
        id: g.id || Math.random().toString(36).substring(2, 15),
        archived: false,
        createdAt: new Date().toISOString(),
        order: i,
      })) as Goal[];

    dispatch({
      type: 'SET',
      payload: {
        name,
        age,
        avatar,
        focus,
        goals: finalGoals,
        reminderEnabled,
        setup: true,
        streakFreezes: 1,
      },
    });

    if (state.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1500);
  };

  const addGoalRow = () => {
    if (goals.length < 6) {
      setGoals([...goals, { id: Math.random().toString(36).substring(2, 15), name: '', cat: 'fitness', difficulty: 'medium', frequency: 'daily', customDays: [] }]);
    }
  };

  const removeGoalRow = (idx: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== idx));
    }
  };

  const updateGoal = (idx: number, updates: Partial<Goal>) => {
    const newGoals = [...goals];
    newGoals[idx] = { ...newGoals[idx], ...updates };
    setGoals(newGoals);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <Animated.View key={i} style={[
              styles.dot, 
              step === i && styles.dotActive
            ]} />
          ))}
        </View>
      </View>

      <View style={styles.contentWrapper}>
        {/* Step 1 */}
        {step === 0 && (
          <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Who are you?</Text>
            <Text style={styles.subtitle}>Set up your P23TRACK profile.</Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={C.DIM}
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Age"
              placeholderTextColor={C.DIM}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={2}
            />

            <Text style={styles.label}>Choose your avatar</Text>
            <View style={styles.grid}>
              {AVATARS.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[styles.avatarCell, avatar === a && styles.avatarCellSelected]}
                  onPress={() => setAvatar(a)}
                >
                  <Text style={{ fontSize: 24 }}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Primary focus</Text>
            <View style={styles.focusGrid}>
              {FOCUSES.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.focusPill, focus === f.id && { backgroundColor: f.color }]}
                  onPress={() => setFocus(f.id)}
                >
                  <Text style={[styles.focusText, focus === f.id && { color: '#fff' }]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Build your habits</Text>
            <Text style={styles.subtitle}>Start with 1–6 daily goals.</Text>

            {goals.map((g, i) => (
              <View key={g.id} style={styles.goalRow}>
                <View style={styles.goalRowLeft}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. LeetCode daily"
                    placeholderTextColor={C.DIM}
                    value={g.name}
                    onChangeText={(v) => updateGoal(i, { name: v })}
                  />
                  <View style={styles.pillRow}>
                    {['career', 'fitness', 'life'].map(cat => (
                      <TouchableOpacity key={cat} onPress={() => updateGoal(i, { cat: cat as Category })}>
                        <Text style={[styles.microPill, g.cat === cat && { backgroundColor: C.CAT_G[cat as Category], borderColor: C.CAT[cat as Category] }]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {goals.length > 1 && (
                  <TouchableOpacity onPress={() => removeGoalRow(i)} style={styles.removeBtn}>
                    <Feather name="x" size={16} color={C.PINK} />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {goals.length < 6 && (
              <TouchableOpacity style={styles.ghostBtn} onPress={addGoalRow}>
                <Text style={styles.ghostBtnText}>+ Add another goal</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Never miss a day</Text>
            <Text style={styles.subtitle}>We'll remind you before midnight.</Text>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Daily reminder (9:00 PM)</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: C.BORDER, true: C.PINK_G }}
                thumbColor={reminderEnabled ? C.PINK : C.DIM}
              />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🧊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Streak Freezes</Text>
                <Text style={styles.infoBody}>Miss a day? A streak freeze protects your streak automatically. You start with <Text style={{ color: C.BLUE }}>1</Text>. Earn more by hitting 7-day milestones.</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.nextBtn, saving && { opacity: 0.8 }]} onPress={finish} disabled={saving}>
              <Text style={styles.nextBtnText}>{saving ? 'Setting up...' : "Let's go! 🚀"}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.BG },
  header: { height: 60, justifyContent: 'center', alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.BORDER },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.PINK },
  contentWrapper: { flex: 1 },
  stepContainer: { flex: 1, paddingHorizontal: S.SCREEN_H },
  stepContent: { paddingBottom: 40 },
  title: { ...T.TITLE, color: C.TEXT, marginTop: 20 },
  subtitle: { ...T.BODY, color: C.MUTED, marginBottom: 32 },
  input: {
    backgroundColor: C.SURFACE,
    borderWidth: 1,
    borderColor: C.BORDER,
    borderRadius: S.R_MD,
    padding: 14,
    color: C.TEXT,
    ...T.BODY,
  },
  label: { ...T.LABEL, color: C.TEXT, marginTop: 24, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  avatarCell: {
    width: 52, height: 52,
    backgroundColor: C.CARD,
    borderRadius: S.R_MD,
    borderWidth: 1,
    borderColor: C.BORDER,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarCellSelected: {
    borderColor: C.PINK,
    backgroundColor: C.PINK_G,
    borderWidth: 1.5,
  },
  focusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  focusPill: {
    flex: 1, minWidth: '45%',
    height: 40,
    backgroundColor: C.SURFACE,
    borderRadius: S.R_MD,
    borderWidth: 1,
    borderColor: C.BORDER,
    justifyContent: 'center', alignItems: 'center',
  },
  focusText: { ...T.LABEL, color: C.TEXT },
  nextBtn: {
    backgroundColor: C.PINK,
    height: 52,
    borderRadius: S.R_MD,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 40,
  },
  nextBtnText: { ...T.HEADING, color: '#fff' },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  goalRowLeft: { flex: 1 },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  microPill: {
    ...T.MICRO, color: C.MUTED,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: S.R_SM,
    borderWidth: 1, borderColor: C.BORDER,
    textTransform: 'capitalize',
  },
  removeBtn: {
    width: 32, height: 32,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 8,
  },
  ghostBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostBtnText: { ...T.LABEL, color: C.DIM },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.CARD,
    padding: 16,
    borderRadius: S.R_LG,
    borderWidth: 1,
    borderColor: C.BORDER,
  },
  toggleLabel: { ...T.LABEL, color: C.TEXT },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: C.CARD,
    padding: 16,
    borderRadius: S.R_LG,
    borderWidth: 1,
    borderColor: C.BORDER,
    borderLeftWidth: 3,
    borderLeftColor: C.BLUE,
    marginTop: 24,
    gap: 12,
  },
  infoIcon: { fontSize: 24 },
  infoTitle: { ...T.LABEL, color: C.TEXT, marginBottom: 4 },
  infoBody: { ...T.BODY, color: C.MUTED, fontSize: 13, lineHeight: 18 },
});
