import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../constants/theme';

interface DailyActivityChartProps {
  data: Array<{ label: string; count: number; status: 'done' | 'missed' | 'today' }>;
  maxCount: number;
}

export const DailyActivityChart = React.memo(function DailyActivityChart({ data, maxCount }: DailyActivityChartProps) {
  const safeMax = maxCount || 1;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily activity</Text>
        <Text style={styles.legend}>habits / day</Text>
      </View>

      <View style={styles.chartArea}>
        {data.map((item, idx) => {
          const heightPct = (item.count / safeMax) * 72; // Max operational height cap at 72px per spec
          let barColor: string = Colors.purple;
          if (item.status === 'missed') barColor = 'rgba(139,92,246,0.18)';
          if (item.status === 'today') barColor = Colors.amber;

          return (
            <View key={idx} style={styles.columnColumn}>
              <View style={styles.track}>
                <View style={[styles.bar, { height: heightPct, backgroundColor: barColor }]} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  legend: {
    fontSize: Typography.xs,
    color: Colors.text3,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 90,
    gap: 6,
  },
  columnColumn: {
    flex: 1,
    alignItems: 'center',
  },
  track: {
    height: 72,
    justifyContent: 'flex-end',
    width: '100%',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  label: {
    fontSize: 9, // Absolute specific matching pixel boundary for charts
    color: Colors.text3,
    marginTop: 4,
    textAlign: 'center',
  },
});
