import { Platform } from 'react-native';

export const Colors = {
  // Backgrounds
  bg:           '#09090B',  
  surface:      '#111115',  
  card:         '#16161C',  
  cardHover:    '#1C1C24',  

  // Purple (primary brand)
  purple:       '#8B5CF6',
  purpleDim:    '#6D28D9',
  purpleGlow:   'rgba(139,92,246,0.12)',
  purpleSoft:   'rgba(139,92,246,0.06)',

  // Borders
  border:       'rgba(139,92,246,0.15)',
  borderStrong: 'rgba(139,92,246,0.35)',
  borderMuted:  'rgba(255,255,255,0.06)',

  // Text
  text:         '#F4F4F5',  
  text2:        '#A1A1AA',  
  text3:        '#71717A',  

  // Accents
  green:        '#34D399',
  greenDim:     'rgba(52,211,153,0.10)',
  amber:        '#FBBF24',
  amberDim:     'rgba(251,191,36,0.08)',
  pink:         '#EC4899',
  pinkDim:     'rgba(236,72,153,0.08)',
  blue:         '#60A5FA',
  blueDim:      'rgba(96,165,250,0.08)',
  slate:        '#94A3B8',
  slateDim:     'rgba(148,163,184,0.08)',

  // Danger
  danger:       '#EF4444',
} as const;

export const Typography = {
  xs: 10, sm: 12, base: 14, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30,
  regular: '400' as const,
  medium:  '500' as const,
  semibold:'600' as const,
  bold:    '700' as const,
  heavy:   '800' as const,
  tight:  -0.5,
  normal:  0,
  wide:    0.5,
  wider:   1.2,
  widest:  1.8,
} as const;

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32,
} as const;

export const Radius = {
  xs: 6, sm: 10, md: 14, lg: 18, xl: 24, full: 999,
} as const;

export const Shadows = {
  purple: Platform.select({
    ios: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    android: {
      elevation: 12,
    },
  }) || {},
  subtle: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }) || {},
} as const;
