import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Radius } from '../../constants/theme';

interface QuickAddRowProps {
  onPress: () => void;
}

export const QuickAddRow = React.memo(function QuickAddRow({ onPress }: QuickAddRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.dashedContainer}>
        <SymbolView name="plus" size={22} tintColor={Colors.purple} />
      </View>
      <Text style={styles.label}>Add a habit</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 76, 
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(139,92,246,0.25)',
    borderRadius: Radius.sm,
    paddingHorizontal: 16,
    gap: 14,
  },
  dashedContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(139,92,246,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.text3,
  },
});
