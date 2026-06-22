import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Radius, Typography } from '../../constants/theme';
import { Badge } from '../../context/types';

interface BadgeGridProps {
  badges: Badge[];
}

const { width: screenWidth } = Dimensions.get('window');
const TILE_SIZE = (screenWidth - 40 - 20) / 3;

export const BadgeGrid = React.memo(function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <View style={styles.grid}>
      {badges.map((badge) => {
        return (
          <View key={badge.id} style={[styles.tile, { width: TILE_SIZE, height: TILE_SIZE }]}>
            <SymbolView
              name={badge.symbol as any}
              size={32}
              tintColor={badge.unlocked ? badge.color : Colors.text3}
              weight="medium"
              style={{ opacity: badge.unlocked ? 1.0 : 0.25 }}
            />
            <Text style={[styles.name, { opacity: badge.unlocked ? 1.0 : 0.4 }]}>
              {badge.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
  },
  name: {
    fontSize: Typography.xs,
    color: Colors.text3,
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
});
