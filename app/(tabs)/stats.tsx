import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Colors, Typography, Spacing, Radius } from '../../src/constants/theme';
import { StatGrid } from '../../src/components/stats/StatGrid';
import { DailyActivityChart } from '../../src/components/stats/DailyActivityChart';
import { SectionHeader } from '../../src/components/shared/SectionHeader';
import { HabitBreakdownRow } from '../../src/components/stats/HabitBreakdownRow';
import { BestDayCard } from '../../src/components/stats/BestDayCard';
import { useAppContext } from '../../src/context/AppContext';

export default function StatsScreen() {
  const { state } = useAppContext();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const chartData = [
    { label: 'Mon', count: 4, status: 'done' as const },
    { label: 'Tue', count: 5, status: 'done' as const },
    { label: 'Wed', count: 2, status: 'missed' as const },
    { label: 'Thu', count: 6, status: 'done' as const },
    { label: 'Fri', count: 6, status: 'done' as const },
    { label: 'Sat', count: 3, status: 'today' as const },
    { label: 'Sun', count: 0, status: 'missed' as const },
  ];

  return (
    <SafeScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <View style={styles.togglePill}>
          <Pressable 
            onPress={() => setViewMode('week')} 
            style={[styles.toggleItem, viewMode === 'week' && styles.toggleItemActive]}
          >
            <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>Week</Text>
          </Pressable>
          <Pressable 
            onPress={() => setViewMode('month')} 
            style={[styles.toggleItem, viewMode === 'month' && styles.toggleItemActive]}
          >
            <Text style={[styles.toggleText, viewMode === 'month' && styles.toggleTextActive]}>Month</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.subtitle}>June 16 – 22</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatGrid 
          completionRate="83%" 
          streak={state.streak} 
          habitsDone={32} 
          possible={42} 
        />
        
        <DailyActivityChart data={chartData} maxCount={6} />

        <SectionHeader title="By Habit" />
        <View style={styles.breakdownCard}>
          {state.habits.map((h) => (
            <HabitBreakdownRow key={h.id} habit={h} fraction="7/7" progress={1.0} />
          ))}
        </View>

        <BestDayCard dayName="Friday" completionsCount={6} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: Spacing.sm,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 2,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleItem: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  toggleItemActive: {
    backgroundColor: Colors.purpleGlow,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  toggleText: {
    fontSize: Typography.sm,
    color: Colors.text3,
    fontWeight: Typography.medium,
  },
  toggleTextActive: {
    color: Colors.purple,
    fontWeight: Typography.semibold,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.text3,
    paddingHorizontal: 20,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  breakdownCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
