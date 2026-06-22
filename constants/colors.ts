export const C = {
  // Backgrounds (darkest to lightest)
  BG:          '#0a0a0f',   // deepest black — screen backgrounds
  SURFACE:     '#111118',   // inputs, tab bar, bottom panels  
  CARD:        '#18181f',   // all cards, modals, sheets

  // Borders
  BORDER:      '#2a2a35',   // default border — always 0.5px
  BORDER_ACT:  '#3a3a48',   // active/hover border — 1px

  // Text
  TEXT:        '#f0f0f5',   // primary text
  MUTED:       '#8888aa',   // secondary text, labels
  DIM:         '#4a4a62',   // placeholder, disabled, timestamps

  // Primary — Pink (actions, streaks, fitness)
  PINK:        '#D4537E',
  PINK_L:      '#ED93B1',   // soft accents, light text on dark
  PINK_D:      '#72243E',   // pressed states
  PINK_G:      '#D4537E18', // glow backgrounds, tinted cards

  // Secondary — Blue (career, info, secondary actions)
  BLUE:        '#378ADD',
  BLUE_L:      '#85B7EB',
  BLUE_D:      '#0C447C',
  BLUE_G:      '#378ADD18',

  // Semantic
  AMBER:       '#EF9F27',   // XP, energy, warnings, rank
  AMBER_L:     '#F5C070',
  TEAL:        '#1D9E75',   // life category, success, completed
  TEAL_L:      '#5FD5A8',
  PURPLE:      '#7F77DD',   // analytics, insights
  PURPLE_L:    '#B0AAEE',

  // Category map
  CAT: {
    career:  '#378ADD',
    fitness: '#D4537E',
    life:    '#1D9E75',
  },
  CAT_G: {
    career:  '#378ADD18',
    fitness: '#D4537E18',
    life:    '#1D9E7518',
  },
  CAT_L: {
    career:  '#85B7EB',
    fitness: '#ED93B1',
    life:    '#5FD5A8',
  },

  // Difficulty map
  DIFF: {
    easy:   '#1D9E75',
    medium: '#EF9F27',
    hard:   '#D4537E',
  },
} as const;
