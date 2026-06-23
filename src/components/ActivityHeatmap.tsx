import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView
} from 'react-native';
import { p23 } from '../constants/theme';
import { Goal, DailyLogEntry } from '../lib/storage';

interface Props {
  goals: Goal[];
  dailyLogs: Record<string, DailyLogEntry>;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Format a Date to 'YYYY-MM-DD' */
function fmtKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Build an array of all days in the current year, padded so week 0 starts on Sunday */
function buildYearGrid(): { date: Date; key: string }[][] {
  const year = new Date().getFullYear();
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);

  // Pad to start of week (Sunday = 0)
  const startPad = jan1.getDay(); // 0=Sun … 6=Sat
  const start = new Date(jan1);
  start.setDate(start.getDate() - startPad);

  const weeks: { date: Date; key: string }[][] = [];
  let current = new Date(start);

  while (current <= dec31) {
    const week: { date: Date; key: string }[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: new Date(current), key: fmtKey(current) });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS   = ['S','M','T','W','T','F','S'];

const CELL = 11;   // cell size px
const GAP  = 2;    // gap between cells

// ── Cell colour ──────────────────────────────────────────────────────────────
function cellColor(ratio: number | null): string {
  if (ratio === null) return 'rgba(255,255,255,0.04)';
  if (ratio === 0)    return 'rgba(255,255,255,0.04)';
  if (ratio < 0.34)   return 'rgba(138,43,226,0.25)';
  if (ratio < 0.67)   return 'rgba(138,43,226,0.55)';
  if (ratio < 1)      return 'rgba(138,43,226,0.80)';
  return p23.purple;
}

// ── Tooltip content ──────────────────────────────────────────────────────────
const MOOD_LABEL: Record<number, string> = { 1:'😔 Low', 2:'😕 Meh', 3:'😐 Okay', 4:'🙂 Good', 5:'😄 Great' };

export default function ActivityHeatmap({ goals, dailyLogs }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const todayKey = fmtKey(new Date());
  const year = new Date().getFullYear();

  // Precompute completion ratio per day
  const ratioMap = useMemo(() => {
    const map: Record<string, number | null> = {};
    // Only process dates where at least one goal has ever been completed
    const allDates = new Set<string>();
    goals.forEach(g => g.completedDates.forEach(d => allDates.add(d)));
    Object.keys(dailyLogs).forEach(d => allDates.add(d));

    allDates.forEach(dateKey => {
      const done = goals.filter(g => g.completedDates.includes(dateKey)).length;
      map[dateKey] = goals.length > 0 ? done / goals.length : 0;
    });
    return map;
  }, [goals, dailyLogs]);

  // Which months start in which week column (for month labels)
  const weeks = useMemo(() => buildYearGrid(), []);
  const monthStartWeeks = useMemo(() => {
    const result: { month: number; weekIdx: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const m = week[0].date.getMonth();
      if (m !== lastMonth && week[0].date.getFullYear() === year) {
        result.push({ month: m, weekIdx: wi });
        lastMonth = m;
      }
    });
    return result;
  }, [weeks]);

  // Tooltip data for selected cell
  const tooltipData = useMemo(() => {
    if (!selected) return null;
    const done  = goals.filter(g => g.completedDates.includes(selected)).length;
    const total = goals.length;
    const log   = dailyLogs[selected];
    const [y, mo, d] = selected.split('-').map(Number);
    const dateObj = new Date(y, mo - 1, d);
    const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { label, done, total, mood: log?.mood ?? null };
  }, [selected, goals, dailyLogs]);

  // Summary stats
  const totalActive = Object.values(ratioMap).filter(r => r !== null && r! > 0).length;
  const perfectDays = Object.values(ratioMap).filter(r => r === 1).length;

  return (
    <View style={s.wrapper}>
      {/* Section header */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Activity</Text>
        <Text style={s.sectionSub}>{year}</Text>
      </View>

      {/* Summary chips */}
      <View style={s.chips}>
        <View style={s.chip}>
          <Text style={s.chipNum}>{totalActive}</Text>
          <Text style={s.chipLabel}>active days</Text>
        </View>
        <View style={s.chipDiv} />
        <View style={s.chip}>
          <Text style={[s.chipNum, { color: p23.purple }]}>{perfectDays}</Text>
          <Text style={s.chipLabel}>perfect days</Text>
        </View>
      </View>

      {/* The heatmap grid — horizontally scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.gridScroll}
      >
        <View>
          {/* Month labels row */}
          <View style={s.monthRow}>
            {monthStartWeeks.map(({ month, weekIdx }) => (
              <Text
                key={month}
                style={[s.monthLabel, { left: weekIdx * (CELL + GAP) }]}
              >
                {MONTH_LABELS[month]}
              </Text>
            ))}
          </View>

          {/* Grid: weeks × 7 days */}
          <View style={s.grid}>
            {/* Day-of-week labels column */}
            <View style={s.dayLabelCol}>
              {DAY_LABELS.map((d, i) => (
                <Text key={i} style={s.dayLabel}>{i % 2 === 1 ? d : ''}</Text>
              ))}
            </View>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <View key={wi} style={s.weekCol}>
                {week.map(({ date, key }) => {
                  const isCurrentYear = date.getFullYear() === year;
                  const ratio = isCurrentYear ? (ratioMap[key] ?? null) : null;
                  const isToday = key === todayKey;
                  const isSelected = key === selected;

                  return (
                    <Pressable
                      key={key}
                      onPress={() => {
                        if (!isCurrentYear) return;
                        setSelected(isSelected ? null : key);
                      }}
                      style={[
                        s.cell,
                        { backgroundColor: isCurrentYear ? cellColor(ratio) : 'transparent' },
                        isToday && s.cellToday,
                        isSelected && s.cellSelected,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={s.legend}>
            <Text style={s.legendLabel}>Less</Text>
            {[null, 0.2, 0.5, 0.8, 1].map((r, i) => (
              <View key={i} style={[s.legendCell, { backgroundColor: cellColor(r) }]} />
            ))}
            <Text style={s.legendLabel}>More</Text>
          </View>
        </View>
      </ScrollView>

      {/* Tooltip */}
      {tooltipData && selected && (
        <View style={s.tooltip}>
          <Text style={s.tooltipDate}>{tooltipData.label}</Text>
          <View style={s.tooltipRow}>
            <Text style={s.tooltipStat}>
              <Text style={{ color: p23.purple, fontFamily: 'SpaceGrotesk-Bold' }}>
                {tooltipData.done}
              </Text>
              <Text style={{ color: p23.muted }}> / {tooltipData.total} goals</Text>
            </Text>
            {tooltipData.mood && (
              <Text style={s.tooltipMood}>{MOOD_LABEL[tooltipData.mood]}</Text>
            )}
          </View>
          {tooltipData.done === 0 && tooltipData.total > 0 && (
            <Text style={s.tooltipEmpty}>No goals completed this day</Text>
          )}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: p23.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: p23.border,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    color: p23.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold',
  },
  sectionSub: {
    color: p23.muted, fontSize: 13, fontFamily: 'DMSans-Regular',
  },

  // Stats chips
  chips: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 16,
  },
  chip: { alignItems: 'center' },
  chipNum: { color: p23.text, fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', lineHeight: 24 },
  chipLabel: { color: p23.muted, fontSize: 10, fontFamily: 'DMSans-Regular', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },
  chipDiv: { width: 1, height: 28, backgroundColor: p23.border },

  // Grid
  gridScroll: { paddingBottom: 4 },
  monthRow: {
    height: 16, position: 'relative', marginLeft: 16, marginBottom: 4,
  },
  monthLabel: {
    position: 'absolute', color: 'rgba(255,255,255,0.35)',
    fontSize: 9, fontFamily: 'DMSans-Regular',
  },
  grid: { flexDirection: 'row' },
  dayLabelCol: { width: 14, marginRight: 2, paddingTop: 1 },
  dayLabel: {
    height: CELL + GAP, lineHeight: CELL + GAP,
    color: 'rgba(255,255,255,0.25)', fontSize: 8,
    fontFamily: 'DMSans-Regular',
  },
  weekCol: { flexDirection: 'column', marginRight: GAP },
  cell: {
    width: CELL, height: CELL,
    borderRadius: 2,
    marginBottom: GAP,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: p23.purple,
  },
  cellSelected: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // Legend
  legend: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10,
  },
  legendLabel: {
    color: 'rgba(255,255,255,0.25)', fontSize: 9, fontFamily: 'DMSans-Regular',
  },
  legendCell: {
    width: 10, height: 10, borderRadius: 2,
  },

  // Tooltip
  tooltip: {
    marginTop: 14, backgroundColor: p23.void,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: p23.border,
  },
  tooltipDate: {
    color: p23.text, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 6,
  },
  tooltipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tooltipStat: { fontSize: 13, fontFamily: 'DMSans-Regular' },
  tooltipMood: { color: p23.muted, fontSize: 12, fontFamily: 'DMSans-Regular' },
  tooltipEmpty: { color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DMSans-Regular', marginTop: 4 },
});
