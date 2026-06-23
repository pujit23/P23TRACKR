import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { p23 } from '../constants/theme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface GoalCardProps {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: string;
  progress: number;
  xpReward: number;
  done: boolean;
  onComplete: (id: string) => void;
}

export default function GoalCard({ id, title, category, streak, target, progress, xpReward, done, onComplete }: GoalCardProps) {
  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress}%`, { duration: 600 }),
    };
  });

  return (
    <Pressable onPress={() => onComplete(id)} style={styles.card}>
      <View style={[styles.bg, done && styles.bgDone]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <View style={[styles.checkCircle, done && styles.checkCircleDone]}>
            {done && <Feather name="check" size={14} color="#FFF" />}
          </View>
        </View>

        <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
        <Text style={styles.target}>{target}</Text>

        <View style={styles.footer}>
          <View style={styles.statRow}>
            <FontAwesome5 name="fire" size={12} color="#FF6B35" />
            <Text style={styles.statText}>{streak} day streak</Text>
          </View>
          <View style={styles.statRow}>
            <Feather name="zap" size={12} color={p23.purple} />
            <Text style={styles.statText}>+{xpReward} XP</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFill, animatedProgressStyle]}>
          <LinearGradient colors={p23.gradients.progress as any} start={{x:0, y:0}} end={{x:1, y:0}} style={StyleSheet.absoluteFill as any} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderColor: p23.border,
    borderWidth: 1,
    backgroundColor: p23.surface,
  },
  bg: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: p23.glass,
  },
  bgDone: {
    backgroundColor: p23.purpleDim,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: p23.purpleDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: p23.purpleGlow,
  },
  categoryText: {
    color: p23.purple,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: p23.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: p23.purple,
    borderColor: p23.purple,
    shadowColor: p23.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: p23.text,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: p23.muted,
  },
  target: {
    color: p23.muted,
    fontSize: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: p23.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 2,
    backgroundColor: p23.void,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    shadowColor: p23.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 2,
  }
});
