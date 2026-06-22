import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/theme';

interface SafeScreenProps {
  children: React.ReactNode;
}

export const SafeScreen = React.memo(function SafeScreen({ children }: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" backgroundColor={Colors.bg as any} />
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
});
