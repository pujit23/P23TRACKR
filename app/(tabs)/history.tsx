import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Colors, Typography, Spacing } from '../../src/constants/theme';
import { MonthCalendar } from '../../src/components/history/MonthCalendar';
import { DayDetail } from '../../src/components/history/DayDetail';

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState('2026-06-22');

  return (
    <SafeScreen>
      <View style={styles.navHeader}>
        <Pressable style={styles.arrow}>
          <SymbolView name="chevron.left" size={18} tintColor={Colors.text2} />
        </Pressable>
        <Text style={styles.monthTitle}>June 2026</Text>
        <Pressable style={styles.arrow}>
          <SymbolView name="chevron.right" size={18} tintColor={Colors.text2} />
        </Pressable>
      </View>

      <View style={styles.weeksRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <Text key={i} style={styles.weekDayLabel}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarWrapper}>
        <MonthCalendar
          currentMonthStr="2026-06"
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </View>

      <DayDetail dateStr={selectedDate} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: Spacing.sm,
  },
  monthTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  arrow: {
    padding: 6,
  },
  weeksRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingHorizontal: 20,
  },
  weekDayLabel: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.text3,
    textAlign: 'center',
    fontWeight: Typography.semibold,
  },
  calendarWrapper: {
    paddingHorizontal: 20,
  },
});
