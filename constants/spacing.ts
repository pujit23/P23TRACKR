export const S = {
  // Spacing
  XS:  4,
  SM:  8,
  MD:  12,
  LG:  16,
  XL:  24,
  XXL: 32,
  SCREEN_H: 20,   // horizontal screen padding
  SCREEN_V: 16,   // vertical screen padding
  CARD_H:   16,   // card horizontal padding
  CARD_V:   14,   // card vertical padding

  // Border radius
  R_SM:   6,    // tags, small buttons
  R_MD:   10,   // inputs, small cards
  R_LG:   14,   // main cards
  R_XL:   20,   // large panels, modals
  R_PILL: 999,  // badges, pills, tabs
  R_FULL: 9999, // avatars, circular elements

  // Border widths
  BORDER:     0.5,
  BORDER_ACT: 1,
  BORDER_EMP: 1.5,  // emphasized
} as const;
