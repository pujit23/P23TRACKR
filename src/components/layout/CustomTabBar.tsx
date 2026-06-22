import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

const ICON_MAPPING: Record<string, string> = {
  index: 'house.fill',
  stats: 'chart.bar.fill',
  history: 'calendar',
  profile: 'person.crop.circle.fill',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        return (
          <TabBarCell
            key={route.key}
            label={label}
            isFocused={isFocused}
            routeName={route.name}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          />
        );
      })}
    </View>
  );
}

interface CellProps {
  label: string;
  isFocused: boolean;
  routeName: string;
  onPress: () => void;
}

const TabBarCell = React.memo(function TabBarCell({ label, isFocused, routeName, onPress }: CellProps) {
  const scale = useSharedValue(1);
  const indicatorScale = useSharedValue(isFocused ? 1 : 0);
  const indicatorOpacity = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    indicatorScale.value = withTiming(isFocused ? 1 : 0, { duration: 180 });
    indicatorOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 180 });
  }, [isFocused, indicatorScale, indicatorOpacity]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1.0, { damping: 14, stiffness: 220 });
  }, [scale]);

  const animatedCell = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIndicator = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ scaleX: indicatorScale.value }],
  }));

  const activeColor = isFocused ? Colors.purple : Colors.text3;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cell}
    >
      <Animated.View style={[styles.centerWrapper, animatedCell]}>
        <Animated.View style={[styles.indicator, animatedIndicator]} />
        <SymbolView
          name={(ICON_MAPPING[routeName] as any) || 'square.fill'}
          size={26}
          tintColor={activeColor}
          weight="medium"
        />
        <Text style={[styles.label, { color: activeColor, fontWeight: isFocused ? Typography.semibold : Typography.medium }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2, // Intentional clean layout spec
    backgroundColor: Colors.purple,
    borderRadius: Radius.full,
  },
  label: {
    fontSize: Typography.xs,
    letterSpacing: Typography.wide,
    marginTop: Spacing.xs,
  },
});
