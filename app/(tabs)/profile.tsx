import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { p23 } from '../../src/constants/theme';
import { useTrackrStore } from '../../src/store/trackrStore';
import { getXPProgress } from '../../src/lib/xp';

export default function Profile() {
  const router = useRouter();
  const { user, badges, resetData } = useTrackrStore();

  if (!user) return null;

  const xpProgress = getXPProgress(user.totalXP);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  const handleReset = () => {
    Alert.alert('Reset Progress', 'Are you sure you want to delete all your progress? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: async () => {
        await resetData();
        router.replace('/onboarding');
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Feather name="user" size={40} color={p23.text} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LEVEL {user.level}</Text>
          </View>
        </View>

        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>XP to Level {user.level + 1}</Text>
            <Text style={styles.xpValues}>{user.totalXP % 500} / 500</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Feather name="zap" size={24} color={p23.purple} />
            <Text style={styles.statNum}>{user.totalXP}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statCard}>
            <FontAwesome5 name="fire" size={24} color="#FF6B35" />
            <Text style={styles.statNum}>{user.streakDays}</Text>
            <Text style={styles.statLabel}>DAY STREAK</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="award" size={24} color="#FFB830" />
            <Text style={styles.statNum}>{unlockedCount}</Text>
            <Text style={styles.statLabel}>BADGES</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="trending-up" size={24} color="#4ADE80" />
            <Text style={styles.statNum}>{user.weeklyAvg}%</Text>
            <Text style={styles.statLabel}>WEEKLY AVG</Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Pressable style={styles.actionRow} onPress={() => Alert.alert('Coming Soon', 'Goal editing will be available in the next update.')}>
            <View style={styles.actionLeft}>
              <Feather name="target" size={20} color={p23.text} />
              <Text style={styles.actionText}>Edit Goals</Text>
            </View>
            <Feather name="chevron-right" size={20} color={p23.muted} />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable style={styles.actionRow} onPress={handleReset}>
            <View style={styles.actionLeft}>
              <Feather name="trash-2" size={20} color="#FF6B6B" />
              <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Reset Progress</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: p23.void },
  scroll: { padding: 20, paddingBottom: 120 },
  profileHeader: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  avatarLarge: { width: 96, height: 96, borderRadius: 48, backgroundColor: p23.surface, borderWidth: 3, borderColor: p23.purple, alignItems: 'center', justifyContent: 'center', shadowColor: p23.purple, shadowRadius: 20, shadowOpacity: 0.6, marginBottom: 16 },
  name: { color: p23.text, fontSize: 32, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 8 },
  levelBadge: { backgroundColor: p23.purpleDim, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: p23.purple },
  levelText: { color: p23.purple, fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  xpCard: { backgroundColor: p23.surface, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: p23.border },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  xpTitle: { color: p23.text, fontSize: 14, fontWeight: 'bold' },
  xpValues: { color: p23.muted, fontSize: 14 },
  xpBarBg: { height: 8, backgroundColor: p23.void, borderRadius: 4, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: p23.purple },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: p23.surface, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: p23.border },
  statNum: { color: p23.text, fontSize: 24, fontFamily: 'SpaceGrotesk-Bold', marginTop: 12, marginBottom: 4 },
  statLabel: { color: p23.muted, fontSize: 10, letterSpacing: 1 },
  actionsCard: { backgroundColor: p23.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: p23.border },
  sectionTitle: { color: p23.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionText: { color: p23.text, fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: p23.border, marginVertical: 4 }
});
