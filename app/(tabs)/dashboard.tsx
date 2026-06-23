import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { format } from 'date-fns';
import { p23 } from '../../src/constants/theme';
import { useTrackrStore } from '../../src/store/trackrStore';
import GoalRing from '../../src/components/GoalRing';
import GoalCard from '../../src/components/GoalCard';
import XPSplash from '../../src/components/XPSplash';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { checkBadgeUnlocks } from '../../src/lib/badgeEngine';

export default function Dashboard() {
  const { user, goals, completeGoal } = useTrackrStore();
  const [xpSplash, setXpSplash] = useState({ show: false, amount: 0 });

  const today = format(new Date(), 'yyyy-MM-dd');
  
  const completedCount = goals.filter(g => g.completedDates.includes(today)).length;
  const totalGoals = goals.length;
  const percentage = totalGoals === 0 ? 0 : (completedCount / totalGoals) * 100;

  const handleCompleteGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const justCompleted = await completeGoal(id, today);
    if (justCompleted && goal.xpReward > 0) {
      setXpSplash({ show: true, amount: goal.xpReward });
      await checkBadgeUnlocks();
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.dateLabel}>{format(new Date(), 'MMMM d, yyyy').toUpperCase()}</Text>
            <Text style={styles.greeting}>Good Morning, {user.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.avatar}>
              <Feather name="user" size={20} color={p23.text} />
            </View>
          </View>
        </View>

        <View style={styles.ringCard}>
          <GoalRing percentage={percentage} size={220} label="DAILY PROGRESS" sublabel={`${completedCount} OF ${totalGoals} GOALS`} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="zap" size={20} color={p23.purple} />
              <Text style={styles.statVal}>{user.totalXP}</Text>
              <Text style={styles.statLabel}>TOTAL XP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="fire" size={20} color="#FF6B35" />
              <Text style={styles.statVal}>{user.streakDays}</Text>
              <Text style={styles.statLabel}>DAY STREAK</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Feather name="trending-up" size={20} color="#4ADE80" />
              <Text style={styles.statVal}>{user.weeklyAvg}%</Text>
              <Text style={styles.statLabel}>WEEKLY AVG</Text>
            </View>
          </View>
        </View>

        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Feather name="target" size={20} color={p23.purple} />
              <Text style={styles.sectionTitle}>Today's Goals</Text>
            </View>
            <Text style={styles.linkText}>Log Mood →</Text>
          </View>

          {goals.map(g => (
            <GoalCard
              key={g.id}
              id={g.id}
              title={g.title}
              category={g.category}
              streak={g.streak}
              target={g.target}
              progress={g.completedDates.includes(today) ? 100 : g.progress}
              xpReward={g.xpReward}
              done={g.completedDates.includes(today)}
              onComplete={handleCompleteGoal}
            />
          ))}
        </View>
      </ScrollView>
      <XPSplash show={xpSplash.show} amount={xpSplash.amount} onDone={() => setXpSplash({ show: false, amount: 0 })} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: p23.void },
  scroll: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  dateLabel: { color: p23.muted, fontSize: 12, letterSpacing: 2, fontFamily: 'DMSans-Regular' },
  greeting: { color: p23.text, fontSize: 24, fontFamily: 'SpaceGrotesk-Bold', marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: p23.purple, alignItems: 'center', justifyContent: 'center', backgroundColor: p23.purpleDim, shadowColor: p23.purple, shadowRadius: 10, shadowOpacity: 0.5 },
  ringCard: { backgroundColor: p23.glass, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: p23.border, shadowColor: p23.purple, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 30, marginBottom: 32 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 32, paddingHorizontal: 10 },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { color: p23.text, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', marginTop: 8 },
  statLabel: { color: p23.muted, fontSize: 10, marginTop: 4, letterSpacing: 1 },
  divider: { width: 1, height: 40, backgroundColor: p23.border },
  goalsSection: { },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: p23.text, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' },
  linkText: { color: p23.purple, fontSize: 14, fontWeight: 'bold' }
});
