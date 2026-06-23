import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { p23 } from '../../src/constants/theme';
import { useTrackrStore } from '../../src/store/trackrStore';
import { BADGE_DEFS } from '../../src/lib/xp';

export default function Badges() {
  const { user, badges } = useTrackrStore();
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const xpFromBadges = badges.filter(b => b.unlocked).reduce((acc, curr) => {
    const def = BADGE_DEFS.find(d => d.id === curr.id);
    return acc + (def?.xp || 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.trophyIcon}>
            <Feather name="award" size={24} color={p23.text} />
          </View>
          <Text style={styles.title}>Badge Showcase</Text>
        </View>
        <Text style={styles.subtitle}>Your milestones, crystallized</Text>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statText}><Text style={{ color: p23.text }}>{unlockedCount} / {BADGE_DEFS.length}</Text> UNLOCKED</Text>
        <Text style={styles.statTextRight}>{xpFromBadges} XP EARNED</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {BADGE_DEFS.map(def => {
            const state = badges.find(b => b.id === def.id);
            const isUnlocked = state?.unlocked;
            const rarityInfo = p23.rarity[def.rarity as keyof typeof p23.rarity];

            return (
              <View key={def.id} style={[styles.badgeCard, isUnlocked ? { backgroundColor: rarityInfo.bg, borderColor: rarityInfo.border } : styles.badgeLocked]}>
                <View style={styles.iconContainer}>
                  {isUnlocked ? (
                    <FontAwesome5 name={def.icon as any} size={32} color={rarityInfo.text} />
                  ) : (
                    <Feather name="lock" size={32} color={p23.muted} />
                  )}
                </View>
                <Text style={[styles.badgeTitle, isUnlocked && { color: p23.text }]}>{def.title}</Text>
                
                {isUnlocked ? (
                  <View style={styles.badgeInfo}>
                    <Text style={[styles.rarityLabel, { color: rarityInfo.text }]}>{def.rarity}</Text>
                    <Text style={styles.xpLabel}>+{def.xp} XP</Text>
                  </View>
                ) : (
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>{state?.progress || 0} / {def.total}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${Math.min(100, ((state?.progress || 0) / def.total) * 100)}%` }]} />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: p23.void },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: p23.border },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trophyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: p23.purpleDim, alignItems: 'center', justifyContent: 'center', shadowColor: p23.purple, shadowRadius: 12, shadowOpacity: 0.6 },
  title: { color: p23.text, fontSize: 24, fontFamily: 'SpaceGrotesk-Bold' },
  subtitle: { color: p23.muted, fontSize: 14, marginTop: 8 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: p23.surface, borderBottomWidth: 1, borderBottomColor: p23.border },
  statText: { color: p23.muted, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  statTextRight: { color: p23.purple, fontSize: 12, fontWeight: 'bold', letterSpacing: 1, textShadowColor: p23.purpleGlow, textShadowRadius: 8 },
  scroll: { padding: 20, paddingBottom: 120 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badgeCard: { width: '48%', borderRadius: 20, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1 },
  badgeLocked: { backgroundColor: 'rgba(10,10,10,0.9)', borderColor: p23.border },
  iconContainer: { height: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  badgeTitle: { color: p23.muted, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center', marginBottom: 8 },
  badgeInfo: { alignItems: 'center' },
  rarityLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  xpLabel: { color: p23.muted, fontSize: 12 },
  progressContainer: { width: '100%', alignItems: 'center' },
  progressText: { color: p23.muted, fontSize: 10, marginBottom: 4 },
  progressBar: { width: '100%', height: 4, backgroundColor: p23.void, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: p23.purple, borderRadius: 2 }
});
