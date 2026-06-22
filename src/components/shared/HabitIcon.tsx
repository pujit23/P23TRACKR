import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Radius } from '../../constants/theme';

export type HabitCategory = 'purple' | 'green' | 'amber' | 'pink' | 'blue' | 'slate';

interface HabitIconProps {
  symbol: string;
  category: HabitCategory;
  size?: number;
}

export const HabitIcon = React.memo(function HabitIcon({ symbol, category, size = 28 }: HabitIconProps) {
  const tintColor = Colors[category] || Colors.purple;

  return (
    <View style={[styles.container, { backgroundColor: Colors[`${category}Dim` as keyof typeof Colors] || Colors.purpleSoft }]}>
      <SymbolView 
        name={(symbol as any) || 'square.fill'} 
        size={size} 
        tintColor={tintColor} 
        weight="medium" 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
