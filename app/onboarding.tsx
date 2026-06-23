import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useTrackrStore } from '../src/store/trackrStore';
import { p23 } from '../src/constants/theme';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PRESET_GOALS = [
  { id: 'p1', title: 'DSA Practice', category: 'Learning', icon: 'code', target: '1 problem daily', xpReward: 50 },
  { id: 'p2', title: 'Cycling', category: 'Fitness', icon: 'bicycle', target: '30 mins', xpReward: 60 },
  { id: 'p3', title: 'Reading', category: 'Learning', icon: 'book', target: '10 pages', xpReward: 40 },
  { id: 'p4', title: 'Workout', category: 'Fitness', icon: 'activity', target: '45 mins', xpReward: 80 },
  { id: 'p5', title: 'Meditation', category: 'Mindfulness', icon: 'sun', target: '10 mins', xpReward: 40 },
  { id: 'p6', title: 'Deep Work', category: 'Productivity', icon: 'briefcase', target: '2 hours', xpReward: 90 },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { setUser, addGoals } = useTrackrStore();

  const handleNext = () => {
    if (step === 2 && !name.trim()) return;
    if (step === 3) {
      if (selectedGoals.length < 2) return;
      finishOnboarding();
      return;
    }
    setStep(s => s + 1);
  };

  const finishOnboarding = async () => {
    await setUser({
      name: name.trim(),
      totalXP: 0,
      streakDays: 0,
      level: 1,
      weeklyAvg: 0
    });
    
    const newGoals = PRESET_GOALS.filter(g => selectedGoals.includes(g.id)).map(g => ({
      id: Date.now().toString() + g.id,
      title: g.title,
      category: g.category,
      target: g.target,
      xpReward: g.xpReward,
      completedDates: [],
      streak: 0,
      progress: 0
    }));

    await addGoals(newGoals);
    router.replace('/(tabs)/dashboard' as Href);
  };

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(g => g !== id));
    } else {
      if (selectedGoals.length >= 5) return;
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.logoContainer}>
              <FontAwesome5 name="fire" size={60} color={p23.purple} />
              <Text style={styles.title}>P23TRACKR</Text>
              <Text style={styles.tagline}>Track. Streak. Evolve.</Text>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor={p23.muted}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Pick 2-5 Goals</Text>
            <Text style={styles.subtitle}>{selectedGoals.length} selected</Text>
            <ScrollView style={{ marginTop: 20 }}>
              <View style={styles.grid}>
                {PRESET_GOALS.map(g => {
                  const isSelected = selectedGoals.includes(g.id);
                  return (
                    <Pressable
                      key={g.id}
                      onPress={() => toggleGoal(g.id)}
                      style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                    >
                      <Feather name={g.icon as any} size={24} color={isSelected ? p23.text : p23.purple} />
                      <Text style={[styles.goalTitle, isSelected && { color: p23.text }]}>{g.title}</Text>
                      <Text style={[styles.goalCategory, isSelected && { color: 'rgba(255,255,255,0.7)' }]}>{g.category}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        <Pressable 
          style={[styles.btn, (step === 2 && !name.trim()) || (step === 3 && selectedGoals.length < 2) ? styles.btnDisabled : null]} 
          onPress={handleNext}
        >
          <LinearGradient colors={p23.gradients.purple as any} start={{x:0, y:0}} end={{x:1, y:1}} style={StyleSheet.absoluteFill as any} />
          <Text style={styles.btnText}>{step === 3 ? 'Start Tracking' : 'Continue'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: p23.void },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  stepContainer: { flex: 1, justifyContent: 'center' },
  logoContainer: { alignItems: 'center' },
  title: { fontSize: 40, fontFamily: 'SpaceGrotesk-Bold', color: p23.text, marginTop: 20 },
  tagline: { fontSize: 18, color: p23.muted, marginTop: 8 },
  header: { fontSize: 32, fontFamily: 'SpaceGrotesk-Bold', color: p23.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: p23.purple },
  input: {
    backgroundColor: p23.surface,
    borderColor: p23.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    fontSize: 20,
    color: p23.text,
    marginTop: 20,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  goalCard: {
    width: '48%',
    backgroundColor: p23.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: p23.border,
    alignItems: 'center',
  },
  goalCardSelected: {
    backgroundColor: p23.purple,
    borderColor: p23.purpleGlow,
  },
  goalTitle: { fontSize: 16, fontWeight: 'bold', color: p23.text, marginTop: 12, textAlign: 'center' },
  goalCategory: { fontSize: 12, color: p23.muted, marginTop: 4 },
  btn: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: p23.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: p23.text, fontSize: 18, fontWeight: 'bold', fontFamily: 'SpaceGrotesk-Bold' }
});
