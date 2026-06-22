import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryLine, VictoryPie, VictoryBar, VictoryScatter, VictoryChart, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useApp } from '../../context/AppContext';
import { C, S, T } from '../../constants';
import { todayKey, previousDay, formatDisplay } from '../../utils/dates';

export default function AnalyticsScreen() {
  const { state } = useApp();
  const [period, setPeriod] = useState<'7D' | '30D' | '90D' | 'All'>('30D');

  const daysCount = period === '7D' ? 7 : period === '30D' ? 30 : period === '90D' ? 90 : 365;
  
  const getPeriodLogs = () => {
    let d = todayKey();
    const range = [];
    for (let i = 0; i < daysCount; i++) {
      range.unshift(d);
      d = previousDay(d);
    }
    return range.map(dateStr => {
      const log = state.logs.find(l => l.date === dateStr);
      return {
        dateStr,
        displayDate: dateStr.split('-').slice(1).join('/'),
        pct: log && state.goals.filter(g => !g.archived).length > 0 
             ? (log.checks.filter(Boolean).length / state.goals.filter(g => !g.archived).length) * 100 
             : 0,
        mood: log?.mood || null,
        checks: log?.checks.filter(Boolean).length || 0
      };
    });
  };

  const data = getPeriodLogs();
  
  const validLogs = state.logs.filter(l => l.checks.some(Boolean));
  
  const getCategoryData = () => {
    let career = 0, fitness = 0, life = 0;
    state.logs.forEach(log => {
      log.checks.forEach((checked, idx) => {
        if (checked && state.goals[idx]) {
          if (state.goals[idx].cat === 'career') career++;
          if (state.goals[idx].cat === 'fitness') fitness++;
          if (state.goals[idx].cat === 'life') life++;
        }
      });
    });
    return [
      { x: 'Career', y: career, color: C.BLUE },
      { x: 'Fitness', y: fitness, color: C.PINK },
      { x: 'Life', y: life, color: C.TEAL }
    ].filter(d => d.y > 0);
  };

  const catData = getCategoryData();

  const exportData = async () => {
    try {
      const csvData = [
        ['Date', 'Checks', 'Mood', 'Energy', 'XP'].join(','),
        ...state.logs.map(l => [l.date, l.checks.filter(Boolean).length, l.mood || '', l.energy || '', state.xp].join(','))
      ].join('\n');
      
      const fileUri = (FileSystem as any).documentDirectory + 'p23track-export.csv';
      await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (e) {
      console.log('Export error', e);
    }
  };

  if (validLogs.length < 3) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>analytics</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
          <Text style={{ ...T.HEADING, color: C.TEXT }}>Not enough data</Text>
          <Text style={{ ...T.BODY, color: C.MUTED, marginTop: 4 }}>Log at least 3 days to see analytics.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>analytics</Text>
        <View style={styles.periodRow}>
          {['7D', '30D', '90D', 'All'].map(p => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p as any)} style={[styles.periodPill, period === p && { backgroundColor: C.PINK }]}>
              <Text style={[styles.periodText, period === p && { color: '#fff' }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Completion Line Chart */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>DAILY COMPLETION %</Text>
          <View style={{ marginLeft: -10, marginTop: 10 }}>
            <VictoryChart height={220} width={340} padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryAxis 
                style={{ axis: { stroke: C.BORDER }, tickLabels: { fill: C.MUTED, fontSize: 10, padding: 5, angle: -45 } }}
                tickValues={data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map(d => d.displayDate)}
              />
              <VictoryAxis dependentAxis 
                style={{ axis: { stroke: C.BORDER }, grid: { stroke: C.BORDER, strokeDasharray: '4' }, tickLabels: { fill: C.MUTED, fontSize: 10, padding: 5 } }}
                tickValues={[0, 25, 50, 75, 100]}
              />
              <VictoryLine
                data={data}
                x="displayDate"
                y="pct"
                style={{ data: { stroke: C.PINK, strokeWidth: 2 } }}
                animate={{ duration: 800, easing: 'cubicInOut' }}
              />
            </VictoryChart>
          </View>
        </View>

        {/* Category Pie Chart */}
        {catData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>BY CATEGORY</Text>
            <View style={{ alignItems: 'center', marginTop: -10 }}>
              <VictoryPie
                data={catData}
                colorScale={catData.map(c => c.color)}
                innerRadius={60}
                height={200}
                width={200}
                labels={() => null}
                animate={{ duration: 800 }}
              />
            </View>
            <View style={styles.legend}>
              {catData.map(c => (
                <View key={c.x} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                  <Text style={styles.legendText}>{c.x}</Text>
                  <Text style={styles.legendValue}>{c.y} checks</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mood Scatter */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>MOOD VS COMPLETION</Text>
          <View style={{ marginLeft: -10 }}>
            <VictoryChart height={220} width={340} padding={{ top: 20, bottom: 40, left: 40, right: 20 }}>
              <VictoryAxis 
                tickValues={[1, 2, 3, 4, 5]}
                tickFormat={['😔', '😐', '🙂', '😊', '🤩']}
                style={{ axis: { stroke: C.BORDER }, tickLabels: { fontSize: 16, padding: 5 } }}
              />
              <VictoryAxis dependentAxis 
                style={{ axis: { stroke: C.BORDER }, grid: { stroke: C.BORDER, strokeDasharray: '4' }, tickLabels: { fill: C.MUTED, fontSize: 10, padding: 5 } }}
                tickValues={[0, 25, 50, 75, 100]}
              />
              <VictoryScatter
                data={data.filter(d => d.mood !== null)}
                x="mood"
                y="pct"
                size={5}
                style={{ data: { fill: C.PINK, opacity: 0.7 } }}
              />
            </VictoryChart>
          </View>
        </View>

        {/* Export */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>EXPORT YOUR DATA</Text>
          <TouchableOpacity style={styles.exportBtn} onPress={exportData}>
            <Text style={styles.exportBtnText}>Export as CSV</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.BG },
  header: { paddingHorizontal: S.SCREEN_H, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.BORDER },
  title: { ...T.TITLE, color: C.TEXT, marginBottom: 12 },
  periodRow: { flexDirection: 'row', gap: 8 },
  periodPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: S.R_PILL, backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER },
  periodText: { ...T.LABEL, color: C.MUTED },
  scrollContent: { paddingHorizontal: S.SCREEN_H, paddingVertical: S.SCREEN_V },
  card: { backgroundColor: C.CARD, borderRadius: S.R_LG, borderWidth: 1, borderColor: C.BORDER, padding: 16, marginBottom: 16, overflow: 'hidden' },
  sectionHeader: { ...T.LABEL, color: C.TEXT, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  legend: { marginTop: 16, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendText: { ...T.LABEL, color: C.TEXT, flex: 1 },
  legendValue: { ...T.CAPTION, color: C.MUTED },
  exportBtn: { borderWidth: 1, borderColor: C.PINK, paddingVertical: 12, borderRadius: S.R_MD, alignItems: 'center', marginTop: 8 },
  exportBtnText: { ...T.LABEL, color: C.PINK },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
});
