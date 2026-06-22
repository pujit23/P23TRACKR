import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useApp } from '../../context/AppContext';
import { C, S, T } from '../../constants';
import { CustomCheckbox } from '../../components/CustomCheckbox';
import { CategoryPill, DifficultyBadge } from '../../components/GoalCategoryPill';
import { todayKey, formatDisplay } from '../../utils/dates';
import { BADGE_DEFS } from '../../utils/badges';

const MOODS = ['😔', '😐', '🙂', '😊', '🤩'];
const ENERGIES = [1, 2, 3, 4, 5];

export default function LogScreen() {
  const { state, saveLog } = useApp();
  const today = todayKey();
  
  const activeGoals = state.goals.filter(g => !g.archived);
  const existingLog = state.logs.find(l => l.date === today);

  const [checks, setChecks] = useState<boolean[]>(existingLog?.checks || new Array(activeGoals.length).fill(false));
  const [goalNotes, setGoalNotes] = useState<string[]>(existingLog?.goalNotes || new Array(activeGoals.length).fill(''));
  const [note, setNote] = useState(existingLog?.note || '');
  const [mood, setMood] = useState<number>(existingLog?.mood || 3);
  const [energy, setEnergy] = useState<number>(existingLog?.energy || 3);
  
  const [expandedNoteIdx, setExpandedNoteIdx] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  // Keep state synced if log changes from elsewhere
  useEffect(() => {
    if (existingLog) {
      setChecks(existingLog.checks);
      setGoalNotes(existingLog.goalNotes);
      setNote(existingLog.note);
      setMood(existingLog.mood);
      setEnergy(existingLog.energy);
    }
  }, [existingLog]);

  const handleSave = () => {
    if (state.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const { xpGained, newBadges } = saveLog({
      date: today,
      checks,
      goalNotes,
      note,
      mood: mood as any,
      energy: energy as any,
    });

    setToastMsg(`Logged ✓  +${xpGained} XP`);
    setTimeout(() => setToastMsg(null), 2500);

    if (newBadges.length > 0) {
      setUnlockedBadges(newBadges);
    }
  };

  const pastLogs = [...state.logs].filter(l => l.date !== today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>today's check-in</Text>
            <View style={styles.todayPill}>
              <Text style={styles.todayPillText}>Today</Text>
            </View>
          </View>

          {activeGoals.length === 0 ? (
             <View style={styles.emptyState}>
               <Text style={{ fontSize: 40, marginBottom: 12 }}>📅</Text>
               <Text style={{ ...T.HEADING, color: C.TEXT }}>No goals yet</Text>
               <Text style={{ ...T.BODY, color: C.MUTED, marginTop: 4 }}>Add goals in the Goals tab first.</Text>
             </View>
          ) : (
            <View style={styles.goalsList}>
              {activeGoals.map((g, i) => (
                <View key={g.id} style={[styles.goalRow, { borderLeftColor: C.CAT[g.cat] }]}>
                  <View style={styles.goalRowMain}>
                    <CustomCheckbox 
                      checked={checks[i]} 
                      onChange={(v) => {
                        const newChecks = [...checks];
                        newChecks[i] = v;
                        setChecks(newChecks);
                      }} 
                      hapticsEnabled={state.hapticsEnabled}
                    />
                    <View style={styles.goalRowCenter}>
                      <Text style={[styles.goalName, checks[i] && styles.goalNameDone]}>{g.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                        <CategoryPill cat={g.cat} size="sm" />
                      </View>
                    </View>
                    <DifficultyBadge diff={g.difficulty} size="sm" />
                    <TouchableOpacity onPress={() => setExpandedNoteIdx(expandedNoteIdx === i ? null : i)} style={{ padding: 4, marginLeft: 4 }}>
                      <Feather name={expandedNoteIdx === i ? "chevron-up" : "chevron-down"} size={18} color={C.DIM} />
                    </TouchableOpacity>
                  </View>
                  
                  {expandedNoteIdx === i && (
                    <TextInput
                      style={styles.goalNoteInput}
                      placeholder="Note for this goal… (optional)"
                      placeholderTextColor={C.DIM}
                      value={goalNotes[i]}
                      onChangeText={(v) => {
                        const newNotes = [...goalNotes];
                        newNotes[i] = v;
                        setGoalNotes(newNotes);
                      }}
                      multiline
                    />
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionHeader}>HOW WAS TODAY?</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.moodBtn, mood === i + 1 && styles.moodBtnActive]}
                  onPress={() => setMood(i + 1)}
                >
                  <Text style={{ fontSize: 24 }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.energyRow}>
              {ENERGIES.map(e => (
                <TouchableOpacity key={e} onPress={() => setEnergy(e)} style={styles.energyBtn}>
                  <Text style={{ fontSize: 24, opacity: e <= energy ? 1 : 0.3 }}>⚡</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.noteContainer}>
            <TextInput
              style={styles.globalNote}
              placeholder="Anything else on your mind today?"
              placeholderTextColor={C.DIM}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={280}
            />
            <Text style={styles.charCount}>{note.length} / 280</Text>
          </View>

          {/* Past Logs */}
          <View style={styles.pastLogsSection}>
            <Text style={styles.sectionHeader}>PAST LOGS ({pastLogs.length})</Text>
            {pastLogs.length === 0 ? (
               <Text style={styles.emptyPast}>No past logs yet. Start logging today.</Text>
            ) : (
              pastLogs.map(log => (
                <View key={log.date} style={styles.pastLogCard}>
                  <View style={styles.pastLogDateBadge}>
                    <Text style={styles.pastLogDateText}>{formatDisplay(log.date)}</Text>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text style={{ ...T.LABEL, color: C.TEXT }}>{log.checks.filter(Boolean).length}/{activeGoals.length} done</Text>
                    <Text style={{ ...T.CAPTION, color: C.MUTED, marginTop: 4 }} numberOfLines={1}>
                      {log.note || 'No notes'}
                    </Text>
                  </View>
                  {log.mood && <Text style={{ fontSize: 18 }}>{MOODS[log.mood - 1]}</Text>}
                </View>
              ))
            )}
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Save Button */}
      <TouchableOpacity 
        style={[styles.saveBtn, toastMsg ? { backgroundColor: C.TEAL } : {}]} 
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>{toastMsg || 'Save Log ✓'}</Text>
      </TouchableOpacity>

      {/* Badge Modal */}
      {unlockedBadges.length > 0 && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <Animated.View entering={SlideInDown} style={styles.badgeModal}>
              <Text style={{ fontSize: 64, marginBottom: 16 }}>{BADGE_DEFS[unlockedBadges[0]].icon}</Text>
              <Text style={styles.modalTitle}>Badge Unlocked!</Text>
              <Text style={styles.modalBadgeName}>{BADGE_DEFS[unlockedBadges[0]].name}</Text>
              <Text style={styles.modalBadgeDesc}>{BADGE_DEFS[unlockedBadges[0]].desc}</Text>
              
              <TouchableOpacity 
                style={styles.modalBtn}
                onPress={() => setUnlockedBadges(prev => prev.slice(1))}
              >
                <Text style={styles.modalBtnText}>Awesome →</Text>
              </TouchableOpacity>
              <ConfettiCannon count={100} origin={{x: 150, y: 0}} fadeOut />
            </Animated.View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.BG },
  scrollContent: { paddingHorizontal: S.SCREEN_H, paddingVertical: S.SCREEN_V },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { ...T.TITLE, color: C.TEXT },
  todayPill: { backgroundColor: C.PINK, paddingHorizontal: 12, paddingVertical: 4, borderRadius: S.R_PILL },
  todayPillText: { ...T.LABEL, color: '#fff' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  goalsList: { marginBottom: 24 },
  goalRow: { 
    borderLeftWidth: 3, 
    borderBottomWidth: 0.5, borderBottomColor: C.BORDER,
    paddingVertical: 12, paddingLeft: 12, paddingRight: 4
  },
  goalRowMain: { flexDirection: 'row', alignItems: 'center' },
  goalRowCenter: { flex: 1, marginLeft: 12 },
  goalName: { ...T.LABEL, color: C.TEXT },
  goalNameDone: { textDecorationLine: 'line-through', color: C.MUTED },
  goalNoteInput: {
    backgroundColor: C.SURFACE, borderRadius: S.R_SM, borderWidth: 1, borderColor: C.BORDER,
    padding: 10, marginTop: 12, marginLeft: 34, ...T.BODY, color: C.TEXT, minHeight: 60
  },
  card: { backgroundColor: C.CARD, borderRadius: S.R_LG, borderWidth: 1, borderColor: C.BORDER, padding: 16, marginBottom: 24 },
  sectionHeader: { ...T.MICRO, color: C.MUTED, marginBottom: 12 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  moodBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.SURFACE, justifyContent: 'center', alignItems: 'center' },
  moodBtnActive: { backgroundColor: C.PINK_G, borderWidth: 1.5, borderColor: C.PINK },
  energyRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 16, borderTopWidth: 1, borderTopColor: C.BORDER },
  energyBtn: { padding: 4 },
  noteContainer: { marginBottom: 32 },
  globalNote: {
    backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, borderRadius: S.R_MD,
    padding: 16, color: C.TEXT, ...T.BODY, minHeight: 100, textAlignVertical: 'top'
  },
  charCount: { ...T.CAPTION, color: C.DIM, position: 'absolute', bottom: 12, right: 12 },
  pastLogsSection: { marginTop: 16 },
  emptyPast: { ...T.BODY, color: C.MUTED, textAlign: 'center', paddingVertical: 32 },
  pastLogCard: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: C.CARD, borderRadius: S.R_MD, borderWidth: 1, borderColor: C.BORDER, 
    padding: 12, marginBottom: 8 
  },
  pastLogDateBadge: { backgroundColor: C.SURFACE, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pastLogDateText: { ...T.MONO, color: C.TEXT },
  saveBtn: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: C.PINK, paddingHorizontal: 24, paddingVertical: 14, borderRadius: S.R_PILL,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  saveBtnText: { ...T.LABEL, color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(24, 24, 31, 0.95)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  badgeModal: { backgroundColor: C.CARD, padding: 32, borderRadius: S.R_XL, alignItems: 'center', borderWidth: 1, borderColor: C.PINK, width: '100%' },
  modalTitle: { ...T.TITLE, color: C.PINK, marginBottom: 8 },
  modalBadgeName: { ...T.HEADING, color: C.TEXT, marginBottom: 4 },
  modalBadgeDesc: { ...T.BODY, color: C.MUTED, textAlign: 'center', marginBottom: 32 },
  modalBtn: { backgroundColor: C.PINK, paddingHorizontal: 32, paddingVertical: 14, borderRadius: S.R_MD, width: '100%', alignItems: 'center' },
  modalBtnText: { ...T.HEADING, color: '#fff' }
});
