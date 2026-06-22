import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { SymbolView } from 'expo-symbols';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { Colors, Typography, Radius, Spacing, Shadows } from '../../constants/theme';
import { Habit } from '../../context/types';
import { HabitCategory } from '../shared/HabitIcon';
import { useHabits } from '../../hooks/useHabits';

interface AddHabitSheetProps {
  visible: boolean;
  onClose: () => void;
  habit?: Habit;
}

const CATEGORIES: HabitCategory[] = ['purple', 'green', 'amber', 'pink', 'blue', 'slate'];
const SYMBOLS = ['figure.walk', 'bicycle', 'book.fill', 'laptopcomputer', 'leaf.fill', 'hammer.fill', 'bolt.fill'];

export function AddHabitSheet({ visible, onClose, habit }: AddHabitSheetProps) {
  const { addHabit, editHabit, deleteHabit } = useHabits();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('purple');
  const [symbol, setSymbol] = useState('figure.walk');
  const [targetType, setTargetType] = useState<'boolean' | 'numeric'>('boolean');
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('');

  const translateY = useSharedValue(600);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      if (habit) {
        setName(habit.name);
        setCategory(habit.category);
        setSymbol(habit.symbol);
        setTargetType(habit.targetType);
        setTargetValue(habit.targetValue?.toString() || '');
        setTargetUnit(habit.targetUnit || '');
      } else {
        setName('');
        setCategory('purple');
        setSymbol('figure.walk');
        setTargetType('boolean');
        setTargetValue('');
        setTargetUnit('');
      }
      translateY.value = withSpring(0, { damping: 26, stiffness: 220 });
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
    }
  }, [visible, habit, translateY, backdropOpacity]);

  const handleDismiss = useCallback(() => {
    translateY.value = withTiming(600, { duration: 200, easing: Easing.in(Easing.cubic) }, () => {
      onClose();
    });
    backdropOpacity.value = withTiming(0, { duration: 200 });
  }, [onClose, translateY, backdropOpacity]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;

    const payload: Habit = {
      id: habit?.id || Math.random().toString(), 
      name,
      symbol,
      category,
      targetType,
      targetValue: targetType === 'numeric' ? Number(targetValue) : undefined,
      targetUnit: targetType === 'numeric' ? targetUnit : undefined,
      baseXP: 10,
      reminderEnabled: false,
      createdAt: habit?.createdAt || new Date().toISOString(),
    };

    if (habit) {
      editHabit(payload);
    } else {
      addHabit(payload);
    }
    handleDismiss();
  }, [name, symbol, category, targetType, targetValue, targetUnit, habit, addHabit, editHabit, handleDismiss]);

  const handleDelete = useCallback(() => {
    if (habit) {
      deleteHabit(habit.id);
      handleDismiss();
    }
  }, [habit, deleteHabit, handleDismiss]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleDismiss}>
      <View style={styles.mask}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        <Pressable style={styles.dismissPressable} onPress={handleDismiss} />
        
        <Animated.View style={[styles.sheet, modalAnimatedStyle]}>
          <View style={styles.handle} />
          
          <ScrollView contentContainerStyle={styles.fields}>
            <Text style={styles.title}>{habit ? 'Edit Habit' : 'New Habit'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Habit Name"
              placeholderTextColor={Colors.text3}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.sectionLabel}>CATEGORY</Text>
            <View style={styles.row}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: Colors[cat] },
                    category === cat && styles.selectedCircle,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>SYMBOL</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.symbolRow}>
              {SYMBOLS.map((sym) => (
                <Pressable
                  key={sym}
                  onPress={() => setSymbol(sym)}
                  style={[styles.symBox, symbol === sym && styles.selectedSymBox]}
                >
                  <SymbolView name={sym as any} size={22} tintColor={symbol === sym ? Colors.purple : Colors.text} />
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.sectionLabel}>TARGET TYPE</Text>
            <View style={styles.segmentContainer}>
              <Pressable
                onPress={() => setTargetType('boolean')}
                style={[styles.segItem, targetType === 'boolean' && styles.segItemActive]}
              >
                <Text style={[styles.segText, targetType === 'boolean' && styles.segTextActive]}>Check-in</Text>
              </Pressable>
              <Pressable
                onPress={() => setTargetType('numeric')}
                style={[styles.segItem, targetType === 'numeric' && styles.segItemActive]}
              >
                <Text style={[styles.segText, targetType === 'numeric' && styles.segTextActive]}>Numeric</Text>
              </Pressable>
            </View>

            {targetType === 'numeric' && (
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { width: 80 }]}
                  placeholder="1000"
                  placeholderTextColor={Colors.text3}
                  keyboardType="numeric"
                  value={targetValue}
                  onChangeText={setTargetValue}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="steps / km / min"
                  placeholderTextColor={Colors.text3}
                  value={targetUnit}
                  onChangeText={setTargetUnit}
                />
              </View>
            )}

            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Habit</Text>
            </Pressable>

            {habit && (
              <Pressable onPress={handleDelete} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>Delete Habit</Text>
              </Pressable>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  dismissPressable: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4, // Clean structural indicator sizing matching specification rule
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginTop: 12,
  },
  fields: {
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  input: {
    height: 48,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    fontSize: Typography.md,
    color: Colors.text,
  },
  sectionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.text3,
    letterSpacing: Typography.widest,
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: Colors.text,
  },
  symbolRow: {
    gap: 10,
  },
  symBox: {
    width: 44,
    height: 44,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSymBox: {
    backgroundColor: Colors.purpleGlow,
    borderColor: Colors.borderStrong,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  segItemActive: {
    backgroundColor: Colors.purpleGlow,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  segText: {
    fontSize: Typography.base,
    color: Colors.text3,
    fontWeight: Typography.medium,
  },
  segTextActive: {
    color: Colors.purple,
    fontWeight: Typography.semibold,
  },
  saveBtn: {
    height: 52,
    backgroundColor: Colors.purple,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Shadows.purple,
  },
  saveBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
  },
  deleteBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: Typography.md,
    color: Colors.danger,
    fontWeight: Typography.medium,
  },
});
