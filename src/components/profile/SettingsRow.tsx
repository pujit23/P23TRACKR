import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors, Typography } from '../../constants/theme';

interface SettingsRowProps {
  icon: string;
  color: string;
  label: string;
  valueType: 'switch' | 'text' | 'chevron';
  textValue?: string;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
}

export const SettingsRow = React.memo(function SettingsRow({
  icon,
  color,
  label,
  valueType,
  textValue,
  switchValue,
  onSwitchChange,
}: SettingsRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <SymbolView name={icon as any} size={22} tintColor={color} />
        <Text style={styles.label}>{label}</Text>
      </View>

      {valueType === 'switch' && (
        <Switch
          trackColor={{ false: Colors.borderMuted, true: Colors.purple }}
          thumbColor="#FFFFFF"
          value={switchValue}
          onValueChange={onSwitchChange}
        />
      )}
      {valueType === 'text' && <Text style={styles.text}>{textValue}</Text>}
      {valueType === 'chevron' && <SymbolView name="chevron.right" size={14} tintColor={Colors.text3} />}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderMuted,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: Typography.md,
    color: Colors.text,
    fontWeight: Typography.medium,
  },
  text: {
    fontSize: Typography.base,
    color: Colors.text3,
  },
});
