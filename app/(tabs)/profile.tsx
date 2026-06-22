import React, { useCallback, useState } from 'react';
import { StyleSheet, ScrollView, Alert, Pressable, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Colors, Typography, Spacing, Radius } from '../../src/constants/theme';
import { ProfileHero } from '../../src/components/profile/ProfileHero';
import { XPProgressBar } from '../../src/components/profile/XPProgressBar';
import { StatCell } from '../../src/components/shared/StatCell';
import { SectionHeader } from '../../src/components/shared/SectionHeader';
import { BadgeGrid } from '../../src/components/profile/BadgeGrid';
import { SettingsRow } from '../../src/components/profile/SettingsRow';
import { Divider } from '../../src/components/shared/Divider';
import { useXP } from '../../src/hooks/useXP';
import { useStreak } from '../../src/hooks/useStreak';
import { useBadges } from '../../src/hooks/useBadges';
import { useAppContext } from '../../src/context/AppContext';
import { clearStorage } from '../../src/utils/storage';

export default function ProfileScreen() {
  const { state, dispatch } = useAppContext();
  const { xp, level, label, xpInLevel, xpForNext } = useXP();
  const { longestStreak } = useStreak();
  const { badges } = useBadges();

  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleResetData = useCallback(() => {
    Alert.alert(
      'Reset All Data',
      'This actions is permanent and will completely clear your history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            dispatch({ type: 'RESET_STATE' });
            await clearStorage();
          },
        },
      ]
    );
  }, [dispatch]);

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileHero level={level} label={label} />
        <XPProgressBar currentXP={xp} nextLevelXP={xp + (xpForNext - xpInLevel)} progress={xpInLevel / xpForNext} />

        <View style={styles.lifetimeRow}>
          <StatCell value={state.habits.length} label="HABITS" color={Colors.amber} />
          <StatCell value={42} label="DAYS RUN" color={Colors.blue} />
          <StatCell value={longestStreak} label="BEST STREAK" color={Colors.green} />
        </View>

        <SectionHeader title="Badges" />
        <BadgeGrid badges={badges} />

        <SectionHeader title="Settings" />
        <View style={styles.settingsGroup}>
          <SettingsRow icon="bell.fill" color={Colors.purple} label="Notifications" valueType="switch" switchValue={notifEnabled} onSwitchChange={setNotifEnabled} />
          <SettingsRow icon="hourglass" color={Colors.amber} label="Reminder Time" valueType="text" textValue="8:00 AM" />
          <SettingsRow icon="square.and.arrow.up" color={Colors.green} label="Export Data" valueType="chevron" />
        </View>

        <Divider />

        <Pressable onPress={handleResetData} style={styles.dangerRow}>
          <SymbolView name="trash.fill" size={22} tintColor={Colors.danger} />
          <Text style={styles.dangerText}>Reset All Data</Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 100,
  },
  lifetimeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: 14,
    marginTop: Spacing.sm,
  },
  settingsGroup: {
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  dangerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dangerText: {
    fontSize: Typography.md,
    color: Colors.danger,
    fontWeight: Typography.medium,
  },
});
