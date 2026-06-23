import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { p23 } from '../../src/constants/theme';
import { useTrackrStore } from '../../src/store/trackrStore';
import XPSplash from '../../src/components/XPSplash';
import { DailyLogEntry } from '../../src/lib/storage';
import { checkBadgeUnlocks } from '../../src/lib/badgeEngine';

const MOODS = [
  { val: 1, emoji: '😔', label: 'Low' },
  { val: 2, emoji: '😕', label: 'Meh' },
  { val: 3, emoji: '😐', label: 'Okay' },
  { val: 4, emoji: '🙂', label: 'Good' },
  { val: 5, emoji: '😄', label: 'Great' }
];

const ENERGY_EMOJIS = ['😴', '😑', '😌', '⚡', '🔥'];

export default function DailyLog() {
  const router = useRouter();
  const { saveDailyLog, dailyLogs } = useTrackrStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const existingLog = dailyLogs[today];

  const [mood, setMood] = useState<number>(existingLog?.mood || 3);
  const [energy, setEnergy] = useState<number>(existingLog?.energy || 3);
  const [sleep, setSleep] = useState(existingLog?.sleep || '');
  const [hydration, setHydration] = useState(existingLog?.hydration || '');
  const [sunlight, setSunlight] = useState(existingLog?.sunlight || '');
  const [notes, setNotes] = useState(existingLog?.notes || '');
  
  const [xpSplash, setXpSplash] = useState(false);
  const [saved, setSaved] = useState(!!existingLog);

  const handleSave = async () => {
    if (saved) return;
    const log: DailyLogEntry = {
      date: today,
      mood: mood as any,
      energy: energy as any,
      sleep,
      hydration,
      sunlight,
      notes,
      xpEarned: 75,
      savedAt: new Date().toISOString()
    };
    await saveDailyLog(log);
    setXpSplash(true);
    setSaved(true);
    await checkBadgeUnlocks();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={p23.text} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Daily Log</Text>
          <Text style={styles.subtitle}>{format(new Date(), 'MMM d, yyyy')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <Pressable
                key={m.val}
                onPress={() => setMood(m.val)}
                style={[styles.moodBtn, mood === m.val && styles.moodBtnActive]}
              >
                <Text style={styles.emoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, mood === m.val && { color: p23.purple }]}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.energyHeader}>
            <Text style={styles.cardTitle}>Energy Level</Text>
            <Text style={styles.energyEmoji}>{ENERGY_EMOJIS[energy - 1]}</Text>
          </View>
          <View style={styles.energyBarContainer}>
            {[1, 2, 3, 4, 5].map(val => (
              <Pressable key={val} style={styles.energySegment} onPress={() => setEnergy(val)}>
                <View style={[styles.energyFill, { backgroundColor: val <= energy ? p23.purple : p23.border }]} />
              </Pressable>
            ))}
          </View>
          <View style={styles.energyLabels}>
            <Text style={styles.energyLabelLeft}>Drained</Text>
            <Text style={styles.energyLabelRight}>Wired</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Habit Checks</Text>
          
          <Text style={styles.habitLabel}><Feather name="moon" size={14} color={p23.muted} /> Sleep Quality</Text>
          <View style={styles.pillRow}>
            {['< 6hrs', '6-7hrs', '7-8hrs', '8hrs+'].map(opt => (
              <Pressable key={opt} style={[styles.pill, sleep === opt && styles.pillActive]} onPress={() => setSleep(opt)}>
                <Text style={[styles.pillText, sleep === opt && styles.pillTextActive]}>{opt}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.habitLabel, { marginTop: 16 }]}><Feather name="droplet" size={14} color={p23.muted} /> Hydration</Text>
          <View style={styles.pillRow}>
            {['1L', '2L', '3L', '4L+'].map(opt => (
              <Pressable key={opt} style={[styles.pill, hydration === opt && styles.pillActive]} onPress={() => setHydration(opt)}>
                <Text style={[styles.pillText, hydration === opt && styles.pillTextActive]}>{opt}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.habitLabel, { marginTop: 16 }]}><Feather name="sun" size={14} color={p23.muted} /> Sunlight Exposure</Text>
          <View style={styles.pillRow}>
            {['None', '10min', '30min', '1hr+'].map(opt => (
              <Pressable key={opt} style={[styles.pill, sunlight === opt && styles.pillActive]} onPress={() => setSunlight(opt)}>
                <Text style={[styles.pillText, sunlight === opt && styles.pillTextActive]}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reflection Notes</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="What's on your mind today?"
            placeholderTextColor={p23.muted}
            value={notes}
            onChangeText={setNotes}
            maxLength={200}
          />
          <Text style={styles.charCount}>{notes.length}/200</Text>
        </View>

        <Pressable style={[styles.saveBtn, saved && styles.saveBtnDisabled]} onPress={handleSave}>
          <LinearGradient colors={(saved ? [p23.border, p23.border] : p23.gradients.purple) as any} start={{x:0, y:0}} end={{x:1, y:1}} style={StyleSheet.absoluteFill as any} />
          <Text style={styles.saveBtnText}>{saved ? 'Log Saved — +75 XP' : 'Save Log'}</Text>
        </Pressable>
      </ScrollView>

      <XPSplash show={xpSplash} amount={75} onDone={() => { setXpSplash(false); router.replace('/(tabs)/dashboard'); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: p23.void },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: p23.surface, alignItems: 'center', justifyContent: 'center' },
  titleContainer: { alignItems: 'center' },
  title: { color: p23.text, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' },
  subtitle: { color: p23.muted, fontSize: 12 },
  scroll: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: p23.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: p23.border },
  cardTitle: { color: p23.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 16 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { alignItems: 'center', flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  moodBtnActive: { backgroundColor: p23.purpleDim, borderColor: p23.purpleGlow },
  emoji: { fontSize: 28, marginBottom: 8 },
  moodLabel: { color: p23.muted, fontSize: 10, fontWeight: 'bold' },
  energyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  energyEmoji: { fontSize: 24 },
  energyBarContainer: { flexDirection: 'row', height: 16, gap: 4 },
  energySegment: { flex: 1, height: '100%', borderRadius: 8, overflow: 'hidden' },
  energyFill: { flex: 1 },
  energyLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  energyLabelLeft: { color: p23.muted, fontSize: 12 },
  energyLabelRight: { color: p23.purple, fontSize: 12, fontWeight: 'bold', textShadowColor: p23.purpleGlow, textShadowOffset: {width:0, height:0}, textShadowRadius: 4 },
  habitLabel: { color: p23.text, fontSize: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: p23.void, borderWidth: 1, borderColor: p23.border },
  pillActive: { backgroundColor: p23.purpleDim, borderColor: p23.purple },
  pillText: { color: p23.muted, fontSize: 12 },
  pillTextActive: { color: p23.text, fontWeight: 'bold' },
  textArea: { backgroundColor: p23.void, borderRadius: 12, padding: 16, color: p23.text, fontSize: 16, height: 100, textAlignVertical: 'top' },
  charCount: { color: p23.muted, fontSize: 10, textAlign: 'right', marginTop: 8 },
  saveBtn: { height: 56, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginTop: 8, shadowColor: p23.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  saveBtnDisabled: { shadowOpacity: 0, opacity: 0.8 },
  saveBtnText: { color: p23.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' }
});
