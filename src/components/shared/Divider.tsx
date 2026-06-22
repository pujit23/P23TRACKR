import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export const Divider = React.memo(function Divider() {
  return <View style={styles.line} />;
});

const styles = StyleSheet.create({
  line: {
    height: 1, // Intentional exact hair-line height
    backgroundColor: Colors.borderMuted,
    width: '100%',
  },
});
