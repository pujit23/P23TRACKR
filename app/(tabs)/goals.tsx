import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { C, S, T } from '../../constants';
import { Goal, Category, Difficulty, Frequency } from '../../types';
import { CategoryPill, DifficultyBadge } from '../../components/GoalCategoryPill';

const CATEGORIES: Category[] = ['career', 'fitness', 'life'];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const FREQUENCIES: Frequency[] = ['daily', 'weekdays', 'custom'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function GoalsScreen() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  // Add Goal State
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<Category>('career');
  const [newDiff, setNewDiff] = useState<Difficulty>('medium');
  const [newFreq, setNewFreq] = useState<Frequency>('daily');
  const [newCustomDays, setNewCustomDays] = useState<number[]>([]);
  
  const shakeAnim = useSharedValue(0);

  const activeGoals = state.goals.filter(g => !g.archived).sort((a, b) => a.order - b.order);
  const archivedGoals = state.goals.filter(g => g.archived);

  const handleAddGoal = () => {
    if (newName.trim().length === 0) {
      if (state.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeAnim.value = withSequence(
        withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }), withTiming(6, { duration: 60 }),
        withTiming(-4, { duration: 60 }), withTiming(4, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      return;
    }

    if (state.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      cat: newCat,
      difficulty: newDiff,
      frequency: newFreq,
      customDays: newCustomDays,
      archived: false,
      createdAt: new Date().toISOString(),
      order: activeGoals.length,
    };

    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    
    // Reset
    setNewName('');
    setNewCat('career');
    setNewDiff('medium');
    setNewFreq('daily');
    setNewCustomDays([]);
    setShowAdd(false);
  };

  const handleArchive = (id: string, archive: boolean = true) => {
    if (state.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: 'UPDATE_GOAL', payload: { id, updates: { archived: archive } } });
  };

  const handleDelete = (id: string) => {
    if (state.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const onDragEnd = ({ data }: { data: Goal[] }) => {
    if (state.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = data.map((g, i) => ({ ...g, order: i }));
    // We need to merge this with archived goals to dispatch full array
    const fullList = [...updated, ...archivedGoals];
    dispatch({ type: 'REORDER_GOALS', payload: fullList });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
    borderColor: shakeAnim.value !== 0 ? C.PINK : C.BORDER,
    borderWidth: shakeAnim.value !== 0 ? 1.5 : 1,
  }));

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Goal>) => {
    const accent = C.CAT[item.cat];
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          activeOpacity={0.9}
          style={[styles.card, isActive && { opacity: 0.8, borderColor: C.PINK }]}
        >
          <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
            <Feather name="menu" size={20} color={C.DIM} />
          </TouchableOpacity>
          <View style={[styles.cardAccent, { backgroundColor: accent }]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={styles.cardBadges}>
              <CategoryPill cat={item.cat} size="sm" />
              <DifficultyBadge diff={item.difficulty} size="sm" />
              <Text style={styles.freqText}>{item.frequency}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleArchive(item.id)} style={styles.actionBtn}>
             <Feather name="archive" size={18} color={C.AMBER} />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>my goals</Text>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{activeGoals.length} active</Text>
        </View>
      </View>

      <DraggableFlatList
        data={activeGoals}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addTriggerBtn} onPress={() => setShowAdd(true)}>
            <Feather name="plus" size={20} color={C.BLUE} />
            <Text style={styles.addTriggerText}>Add New Goal</Text>
          </TouchableOpacity>
        }
        ListFooterComponent={
          archivedGoals.length > 0 ? (
            <View style={{ marginTop: 24 }}>
              <TouchableOpacity style={styles.archiveToggle} onPress={() => setShowArchived(!showArchived)}>
                <Text style={styles.archiveToggleText}>Archived ({archivedGoals.length})</Text>
                <Feather name={showArchived ? "chevron-up" : "chevron-down"} size={16} color={C.MUTED} />
              </TouchableOpacity>
              {showArchived && archivedGoals.map(g => (
                <View key={g.id} style={[styles.card, { opacity: 0.5 }]}>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName}>{g.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleArchive(g.id, false)} style={[styles.actionBtn, { width: 'auto', paddingHorizontal: 10 }] as any}>
                    <Text style={{ ...T.LABEL, color: C.TEAL }}>Restore</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(g.id)} style={[styles.actionBtn, { width: 'auto', paddingHorizontal: 10 }] as any}>
                    <Text style={{ ...T.LABEL, color: C.PINK }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null
        }
      />

      {/* Add Goal Modal */}
      {showAdd && (
        <Modal transparent animationType="none" visible={showAdd} onRequestClose={() => setShowAdd(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowAdd(false)} />
            
            <Animated.View entering={SlideInUp} exiting={SlideOutDown} style={styles.addCard}>
              <View style={styles.addHeader}>
                <Text style={{ ...T.HEADING, color: C.TEXT }}>＋ Add New Goal</Text>
                <TouchableOpacity onPress={() => setShowAdd(false)}>
                  <Feather name="x" size={24} color={C.MUTED} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View style={[styles.inputWrapper, animatedStyle]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Goal name..."
                    placeholderTextColor={C.DIM}
                    value={newName}
                    onChangeText={setNewName}
                    autoFocus
                  />
                </Animated.View>

                <Text style={styles.sectionLabel}>Category</Text>
                <View style={styles.pillRow}>
                  {CATEGORIES.map(c => (
                    <TouchableOpacity 
                      key={c} 
                      onPress={() => setNewCat(c)}
                      style={[styles.selectorPill, newCat === c && { backgroundColor: C.CAT_G[c], borderColor: C.CAT[c] }]}
                    >
                      <Text style={[styles.selectorPillText, newCat === c && { color: C.CAT_L[c] }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>Difficulty</Text>
                <View style={styles.pillRow}>
                  {DIFFICULTIES.map(d => (
                    <TouchableOpacity 
                      key={d} 
                      onPress={() => setNewDiff(d)}
                      style={[styles.selectorPill, newDiff === d && { backgroundColor: C.DIFF[d] + '20', borderColor: C.DIFF[d] }]}
                    >
                      <Text style={[styles.selectorPillText, newDiff === d && { color: C.DIFF[d] }]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>Frequency</Text>
                <View style={styles.pillRow}>
                  {FREQUENCIES.map(f => (
                    <TouchableOpacity 
                      key={f} 
                      onPress={() => setNewFreq(f)}
                      style={[styles.selectorPill, newFreq === f && { backgroundColor: C.SURFACE, borderColor: C.TEXT }]}
                    >
                      <Text style={[styles.selectorPillText, newFreq === f && { color: C.TEXT }]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {newFreq === 'custom' && (
                  <View style={styles.customDaysRow}>
                    {DAYS.map((d, i) => {
                      const active = newCustomDays.includes(i);
                      return (
                        <TouchableOpacity 
                          key={i} 
                          onPress={() => {
                            if (active) setNewCustomDays(newCustomDays.filter(day => day !== i));
                            else setNewCustomDays([...newCustomDays, i].sort());
                          }}
                          style={[styles.dayCircle, active && { backgroundColor: C.PINK, borderColor: C.PINK }]}
                        >
                          <Text style={[styles.dayText, active && { color: '#fff' }]}>{d}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                <TouchableOpacity style={styles.saveBtn} onPress={handleAddGoal}>
                  <Text style={styles.saveBtnText}>Add Goal</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.BG },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.SCREEN_H, paddingVertical: 16 },
  title: { ...T.TITLE, color: C.TEXT, flex: 1 },
  countPill: { backgroundColor: C.PINK_G, paddingHorizontal: 12, paddingVertical: 6, borderRadius: S.R_PILL },
  countPillText: { ...T.LABEL, color: C.PINK_L },
  listContent: { paddingHorizontal: S.SCREEN_H, paddingBottom: 100 },
  addTriggerBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: C.BORDER, borderStyle: 'dashed', borderRadius: S.R_LG,
    paddingVertical: 16, marginBottom: 16, backgroundColor: C.CARD
  },
  addTriggerText: { ...T.LABEL, color: C.BLUE },
  card: {
    flexDirection: 'row', backgroundColor: C.CARD, borderRadius: S.R_LG, borderWidth: 1, borderColor: C.BORDER,
    marginBottom: 8, overflow: 'hidden', alignItems: 'center'
  },
  dragHandle: { padding: 16 },
  cardAccent: { width: 3, height: '100%' },
  cardBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 12 },
  cardName: { ...T.LABEL, color: C.TEXT, marginBottom: 6 },
  cardBadges: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  freqText: { ...T.MICRO, color: C.DIM, marginLeft: 4 },
  actionBtn: { padding: 16, justifyContent: 'center', alignItems: 'center' },
  archiveToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  archiveToggleText: { ...T.LABEL, color: C.MUTED },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10,10,15,0.8)', justifyContent: 'flex-end' },
  addCard: { 
    backgroundColor: C.CARD, borderTopLeftRadius: S.R_XL, borderTopRightRadius: S.R_XL,
    padding: 20, maxHeight: '90%', borderWidth: 1, borderColor: C.BORDER
  },
  addHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  inputWrapper: { borderRadius: S.R_MD, backgroundColor: C.SURFACE, marginBottom: 20 },
  input: { padding: 14, ...T.BODY, color: C.TEXT },
  sectionLabel: { ...T.LABEL, color: C.MUTED, marginBottom: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  selectorPill: { 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: S.R_PILL, 
    borderWidth: 1, borderColor: C.BORDER, backgroundColor: C.SURFACE 
  },
  selectorPillText: { ...T.LABEL, color: C.MUTED, textTransform: 'capitalize' },
  customDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayCircle: { 
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.BORDER, 
    justifyContent: 'center', alignItems: 'center', backgroundColor: C.SURFACE 
  },
  dayText: { ...T.LABEL, color: C.MUTED },
  saveBtn: { backgroundColor: C.BLUE, borderRadius: S.R_MD, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  saveBtnText: { ...T.HEADING, color: '#fff' }
});
