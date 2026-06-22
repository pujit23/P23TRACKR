import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Colors, Radius, Shadows, Typography } from '../../constants/theme';

interface MonthCalendarProps {
  currentMonthStr: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CELL_SIZE = (screenWidth - 40) / 7;

export const MonthCalendar = React.memo(function MonthCalendar({ selectedDate, onSelectDate }: MonthCalendarProps) {
  const daysMock = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.daysGrid}>
        {daysMock.map((day) => {
          const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
          const isSelected = dateStr === selectedDate;
          const isToday = day === 22;

          let bg: string = 'transparent';
          let txt: string = Colors.text;
          let shadow = {};

          if (day % 5 === 0) {
            bg = Colors.purple;
            txt = '#FFFFFF';
            shadow = Shadows.purple;
          } else if (day % 3 === 0) {
            bg = Colors.purpleSoft;
            txt = Colors.text;
          } else if (day > 22) {
            txt = 'rgba(113,113,122,0.3)';
          }

          return (
            <Pressable
              key={day}
              onPress={() => onSelectDate(dateStr)}
              style={[
                styles.cell,
                { backgroundColor: bg },
                isToday && styles.todayRing,
                isSelected && styles.selectedRing,
                shadow,
              ]}
            >
              <Text style={[styles.cellText, { color: txt }, (isToday || isSelected) && styles.boldText]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xs,
  },
  cellText: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  boldText: {
    fontWeight: Typography.bold,
  },
  todayRing: {
    borderWidth: 1.5,
    borderColor: Colors.purple,
  },
  selectedRing: {
    borderWidth: 1.5,
    borderColor: Colors.amber,
  },
});
