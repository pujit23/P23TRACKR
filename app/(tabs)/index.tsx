import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { useAppContext } from '../../src/context/AppContext';
import { useCompletions } from '../../src/hooks/useCompletions';
import { useStreak } from '../../src/hooks/useStreak';
import { getTodayStr } from '../../src/utils/dates';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { StreakCard } from '../../src/components/home/StreakCard';
import { SectionHeader } from '../../src/components/shared/SectionHeader';
import { HabitRow } from '../../src/components/home/HabitRow';
import { QuickAddRow } from '../../src/components/home/QuickAddRow';
import { AddHabitSheet } from '../../src/components/modals/AddHabitSheet';
import { Habit } from '../../src/context/types';

export default function TodayScreen() {
  const { state } = useAppContext();
  const { completions, toggleCompletion } = useCompletions();
  const { streak, weekDots } = useStreak();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  const todayStr = getTodayStr();

  const currentCompletionsCount = useMemo(() => {
    return state.habits.filter((h) => completions[`${h.id}_${todayStr}`]).length;
  }, [state.habits, completions, todayStr]);

  const completedFraction = `${currentCompletionsCount}/${state.habits.length}`;

  const weekRate = useMemo(() => {
    const doneDays = weekDots.filter((d) => d === 'done').length;
    return `${Math.round((doneDays / 7) * 100)}%`;
  }, [weekDots]);

  const openAddModal = useCallback(() => {
    setEditingHabit(undefined);
    setModalVisible(true);
  }, []);

  const openEditModal = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  }, []);

  const fabScale = useSharedValue(1);
  const fabTranslateY = useSharedValue(60);
  const fabOpacity = useSharedValue(0);

  React.useEffect(() => {
    fabTranslateY.value = withDelay(300, withSpring(0, { damping: 20, stiffness: 200 }));
    fabOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
  }, [fabTranslateY, fabOpacity]);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
    transform: [{ translateY: fabTranslateY.value }, { scale: fabScale.value }],
  }));

  const handleFabPressIn = useCallback(() => {
    fabScale.value = withSpring(0.90, { damping: 10, stiffness: 300 });
  }, [fabScale]);

  const handleFabPressOut = useCallback(() => {
    fabScale.value = withSpring(1.0, { damping: 14, stiffness: 220 });
    openAddModal();
  }, [fabScale, openAddModal]);

  return (
    <SafeScreen>
      <View style={styles.headerRow}>
        <Text style={styles.logotype}>
          P23<Text style={styles.logotypeAccent}>TRACKR</Text>
        </Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ME</Text>
        </View>
      </View>
      
      <Text style={styles.subtitle}>Monday, June 22</Text>

      <FlatList
        data={state.habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 + insets.bottom }]}
        ListHeaderComponent={
          <>
            <View style={styles.metaSection}>
              <StreakCard
                streakCount={streak}
                completedFraction={completedFraction}
                weeklyRate={weekRate}
                dots={weekDots}
              />
            </View>
            <SectionHeader title="Today's Habits" />
          </>
        }
        renderItem={({ item }) => {
          const isDone = !!completions[`${item.id}_${todayStr}`];
          return (
            <View style={styles.rowWrapper}>
              <HabitRow
                habit={item}
                isComplete={isDone}
                progress={isDone ? 1 : 0}
                onToggle={() => toggleCompletion(item.id)}
                onPress={() => openEditModal(item)}
              />
            </View>
          );
        }}
        ListFooterComponent={<QuickAddRow onPress={openAddModal} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <Animated.View style={[styles.fab, fabAnimatedStyle]}>
        <Pressable 
          onPressIn={handleFabPressIn} 
          onPressOut={handleFabPressOut} 
          style={styles.fabInteractive}
        >
          <SymbolView name="plus" size={26} tintColor="#FFFFFF" weight="semibold" />
        </Pressable>
      </Animated.View>

      <AddHabitSheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        habit={editingHabit}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  logotype: {
    fontSize: 22,
    fontWeight: Typography.heavy,
    color: Colors.text,
  },
  logotypeAccent: {
    color: Colors.purple,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.purpleDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  avatarText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.text3,
    marginTop: 2,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Spacing.lg,
  },
  metaSection: {
    marginBottom: Spacing.sm,
  },
  rowWrapper: {
    width: '100%',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 58,
    height: 58,
    borderRadius: Radius.md,
    backgroundColor: Colors.purple,
    ...Shadows.purple,
    overflow: 'hidden',
  },
  fabInteractive: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
