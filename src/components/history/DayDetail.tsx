import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography, Radius, Spacing } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

interface DayDetailProps {
  dateStr: string;
}

export const DayDetail = React.memo(function DayDetail({ dateStr }: DayDetailProps) {
  const { state } = useAppContext();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Friday, June 20</Text>
      <View style={styles.list}>
        {state.habits.map((h, i) => {
          const isDone = i % 2 === 0; // Deterministic programmatic render logic
          return (
            <View key={h.id} style={styles.row}>
              <SymbolView
                name={isDone ? 'checkmark.circle.fill' : 'circle'}
                size={18}
                tintColor={isDone ? Colors.green : Colors.border}
              />
              <Text style={[styles.name, { color: isDone ? Colors.text : Colors.text3 }]}>
                {h.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  headerTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontSize: Typography.base,
  },
});
