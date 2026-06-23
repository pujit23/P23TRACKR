import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  Pressable, TextInput, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { p23 } from '../src/constants/theme';
import { useTrackrStore } from '../src/store/trackrStore';
import { Goal } from '../src/lib/storage';

// ── Preset library (extracted as shared constant) ────────────────────────────
const PRESET_LIBRARY = [
  { id: 'p1', title: 'DSA Practice',  category: 'Learning',     icon: 'code',      target: '1 problem daily', xpReward: 50 },
  { id: 'p2', title: 'Cycling',       category: 'Fitness',      icon: 'bicycle',   target: '30 mins',         xpReward: 60 },
  { id: 'p3', title: 'Reading',       category: 'Learning',     icon: 'book',      target: '10 pages',        xpReward: 40 },
  { id: 'p4', title: 'Workout',       category: 'Fitness',      icon: 'activity',  target: '45 mins',         xpReward: 80 },
  { id: 'p5', title: 'Meditation',    category: 'Mindfulness',  icon: 'sun',       target: '10 mins',         xpReward: 40 },
  { id: 'p6', title: 'Deep Work',     category: 'Productivity', icon: 'briefcase', target: '2 hours',         xpReward: 90 },
  { id: 'p7', title: 'Walking',       category: 'Fitness',      icon: 'map-pin',   target: '10,000 steps',    xpReward: 45 },
  { id: 'p8', title: 'Journaling',    category: 'Mindfulness',  icon: 'edit-3',    target: '5 mins',          xpReward: 35 },
  { id: 'p9', title: 'Cold Shower',   category: 'Wellness',     icon: 'droplet',   target: '2 mins cold',     xpReward: 55 },
  { id: 'p10',title: 'Build Project', category: 'Productivity', icon: 'terminal',  target: '30 mins coding',  xpReward: 70 },
];

const CATEGORIES = ['Learning', 'Fitness', 'Mindfulness', 'Productivity', 'Wellness', 'Other'];

type Tab = 'active' | 'add' | 'custom';

export default function EditGoals() {
  const router = useRouter();
  const { goals, removeGoal, addGoals } = useTrackrStore();

  const [tab, setTab] = useState<Tab>('active');

  // Custom goal form state
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Learning');
  const [customTarget, setCustomTarget] = useState('');
  const [customXP, setCustomXP] = useState('50');

  // Active goal titles (for filtering presets)
  const activeTitles = new Set(goals.map(g => g.title));

  // Presets not yet added
  const availablePresets = PRESET_LIBRARY.filter(p => !activeTitles.has(p.title));

  const handleRemoveGoal = (id: string, title: string) => {
    Alert.alert(
      `Remove "${title}"?`,
      'Your completion history for this goal will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeGoal(id),
        },
      ]
    );
  };

  const handleAddPreset = async (preset: typeof PRESET_LIBRARY[0]) => {
    const newGoal: Goal = {
      id: Date.now().toString() + preset.id,
      title: preset.title,
      category: preset.category,
      target: preset.target,
      xpReward: preset.xpReward,
      icon: preset.icon,
      completedDates: [],
      streak: 0,
      progress: 0,
    };
    await addGoals([newGoal]);
    // Briefly switch to active tab to show the new goal
    setTab('active');
  };

  const handleAddCustom = async () => {
    const title = customTitle.trim();
    const target = customTarget.trim();
    const xp = Math.max(10, Math.min(200, parseInt(customXP) || 50));

    if (!title) {
      Alert.alert('Name required', 'Please give your goal a name.');
      return;
    }
    if (!target) {
      Alert.alert('Target required', 'Describe what you need to do each day.');
      return;
    }
    if (activeTitles.has(title)) {
      Alert.alert('Already tracking this', `You already have a goal named "${title}".`);
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString() + 'custom',
      title,
      category: customCategory,
      target,
      xpReward: xp,
      completedDates: [],
      streak: 0,
      progress: 0,
    };
    await addGoals([newGoal]);
    setCustomTitle('');
    setCustomTarget('');
    setCustomXP('50');
    setTab('active');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Feather name="x" size={20} color={p23.text} />
          </Pressable>
          <Text style={s.headerTitle}>Edit Goals</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tab switcher */}
        <View style={s.tabs}>
          {(['active', 'add', 'custom'] as Tab[]).map(t => (
            <Pressable key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'active' ? `Active (${goals.length})` : t === 'add' ? 'Add' : 'Custom'}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* ── ACTIVE GOALS TAB ────────────────────────────────────── */}
          {tab === 'active' && (
            <View>
              {goals.length === 0 && (
                <View style={s.empty}>
                  <Feather name="target" size={40} color={p23.muted} />
                  <Text style={s.emptyText}>No active goals yet.</Text>
                  <Text style={s.emptySubtext}>Tap "Add" to pick from presets.</Text>
                </View>
              )}
              {goals.map(g => (
                <View key={g.id} style={s.goalRow}>
                  <View style={s.goalIcon}>
                    <Feather name={(g.icon as any) || 'target'} size={18} color={p23.purple} />
                  </View>
                  <View style={s.goalInfo}>
                    <Text style={s.goalTitle}>{g.title}</Text>
                    <Text style={s.goalMeta}>{g.category} · {g.target} · +{g.xpReward} XP</Text>
                    <Text style={s.goalDates}>{g.completedDates.length} completions total</Text>
                  </View>
                  <Pressable
                    onPress={() => handleRemoveGoal(g.id, g.title)}
                    style={s.deleteBtn}
                    hitSlop={8}
                  >
                    <Feather name="trash-2" size={16} color="rgba(255,107,107,0.7)" />
                  </Pressable>
                </View>
              ))}

              {goals.length > 0 && (
                <Text style={s.hint}>Tap the trash icon to remove a goal.</Text>
              )}
            </View>
          )}

          {/* ── ADD PRESETS TAB ─────────────────────────────────────── */}
          {tab === 'add' && (
            <View>
              {availablePresets.length === 0 && (
                <View style={s.empty}>
                  <Feather name="check-circle" size={40} color={p23.purple} />
                  <Text style={s.emptyText}>You've added all presets!</Text>
                  <Text style={s.emptySubtext}>Create something custom instead.</Text>
                </View>
              )}
              {availablePresets.map(preset => (
                <Pressable
                  key={preset.id}
                  style={s.presetRow}
                  onPress={() => handleAddPreset(preset)}
                >
                  <View style={s.goalIcon}>
                    <Feather name={preset.icon as any} size={18} color={p23.purple} />
                  </View>
                  <View style={s.goalInfo}>
                    <Text style={s.goalTitle}>{preset.title}</Text>
                    <Text style={s.goalMeta}>{preset.category} · {preset.target}</Text>
                  </View>
                  <View style={s.addChip}>
                    <Text style={s.addChipText}>+{preset.xpReward} XP</Text>
                    <Feather name="plus" size={14} color={p23.purple} />
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* ── CUSTOM GOAL TAB ─────────────────────────────────────── */}
          {tab === 'custom' && (
            <View style={s.customForm}>
              <Text style={s.formLabel}>Goal name</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. Evening Run"
                placeholderTextColor={p23.muted}
                value={customTitle}
                onChangeText={setCustomTitle}
                maxLength={40}
              />

              <Text style={[s.formLabel, { marginTop: 20 }]}>Daily target</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. 5 km"
                placeholderTextColor={p23.muted}
                value={customTarget}
                onChangeText={setCustomTarget}
                maxLength={60}
              />

              <Text style={[s.formLabel, { marginTop: 20 }]}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
                contentContainerStyle={{ gap: 8 }}
              >
                {CATEGORIES.map(cat => (
                  <Pressable
                    key={cat}
                    style={[s.catPill, customCategory === cat && s.catPillActive]}
                    onPress={() => setCustomCategory(cat)}
                  >
                    <Text style={[s.catText, customCategory === cat && s.catTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={[s.formLabel, { marginTop: 20 }]}>XP reward (10–200)</Text>
              <TextInput
                style={s.input}
                placeholder="50"
                placeholderTextColor={p23.muted}
                value={customXP}
                onChangeText={setCustomXP}
                keyboardType="number-pad"
                maxLength={3}
              />

              <Pressable style={s.saveBtn} onPress={handleAddCustom}>
                <LinearGradient
                  colors={p23.gradients.purple as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill as any}
                />
                <Text style={s.saveBtnText}>Add Goal</Text>
              </Pressable>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: p23.void },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: p23.surface, borderWidth: 1, borderColor: p23.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    color: p23.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold',
  },

  // Tabs
  tabs: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 20,
    backgroundColor: p23.surface, borderRadius: 14,
    borderWidth: 1, borderColor: p23.border, padding: 4,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
  },
  tabActive: {
    backgroundColor: p23.purpleDim, borderWidth: 1, borderColor: p23.purpleGlow,
  },
  tabText: { color: p23.muted, fontSize: 12, fontFamily: 'DMSans-Regular' },
  tabTextActive: { color: p23.purple, fontFamily: 'DMSans-Bold' },

  scroll: { paddingHorizontal: 20, paddingBottom: 60 },

  // Goal rows
  goalRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: p23.surface, borderRadius: 16,
    borderWidth: 1, borderColor: p23.border,
    padding: 16, marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: p23.surface, borderRadius: 16,
    borderWidth: 1, borderColor: p23.border,
    padding: 16, marginBottom: 10,
  },
  goalIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: p23.purpleDim, alignItems: 'center', justifyContent: 'center',
    marginRight: 14, flexShrink: 0,
  },
  goalInfo: { flex: 1 },
  goalTitle: { color: p23.text, fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 2 },
  goalMeta: { color: p23.muted, fontSize: 12, fontFamily: 'DMSans-Regular' },
  goalDates: { color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 2, fontFamily: 'DMSans-Regular' },
  deleteBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,107,107,0.08)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.15)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 10,
  },
  addChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: p23.purpleDim, borderRadius: 10, borderWidth: 1, borderColor: p23.purpleGlow,
    paddingHorizontal: 10, paddingVertical: 6, marginLeft: 10,
  },
  addChipText: { color: p23.purple, fontSize: 12, fontFamily: 'DMSans-Bold' },

  // Empty states
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { color: p23.text, fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
  emptySubtext: { color: p23.muted, fontSize: 13, fontFamily: 'DMSans-Regular' },

  hint: { color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 12, fontFamily: 'DMSans-Regular' },

  // Custom form
  customForm: { gap: 0 },
  formLabel: {
    color: 'rgba(255,255,255,0.5)', fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 1.5,
    marginBottom: 10, fontFamily: 'DMSans-Bold',
  },
  input: {
    backgroundColor: p23.surface, borderWidth: 1, borderColor: p23.border,
    borderRadius: 14, padding: 16, fontSize: 16,
    color: p23.text, fontFamily: 'DMSans-Regular',
  },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: p23.surface, borderWidth: 1, borderColor: p23.border,
  },
  catPillActive: {
    backgroundColor: p23.purpleDim, borderColor: p23.purple,
  },
  catText: { color: p23.muted, fontSize: 13, fontFamily: 'DMSans-Regular' },
  catTextActive: { color: p23.purple, fontFamily: 'DMSans-Bold' },

  saveBtn: {
    height: 56, borderRadius: 16, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 28,
    shadowColor: p23.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  saveBtnText: { color: p23.text, fontSize: 17, fontFamily: 'SpaceGrotesk-Bold' },
});
