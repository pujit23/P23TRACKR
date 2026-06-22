import { Platform } from 'react-native';

const BASE = Platform.OS === 'ios' ? 'System' : 'Roboto';

export const T = {
  // Font family
  FONT: BASE,

  // Scale
  HERO:    { fontSize: 42, fontWeight: '700', letterSpacing: -2 },
  TITLE:   { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  HEADING: { fontSize: 18, fontWeight: '600', letterSpacing: -0.3 },
  BODY:    { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  LABEL:   { fontSize: 13, fontWeight: '500', letterSpacing: 0.2 },
  CAPTION: { fontSize: 11, fontWeight: '400', letterSpacing: 0.3 },
  MONO:    { fontSize: 13, fontWeight: '400', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  MICRO:   { fontSize: 10, fontWeight: '500', letterSpacing: 0.5 },
} as const;
