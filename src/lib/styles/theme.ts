export const theme = {
  colors: {
    bg: "var(--canvas)",
    surface: "var(--surface-card)",
    surfaceHover: "var(--surface-strong)",
    border: "var(--hairline)",
    textPrimary: "var(--ink)",
    textSecondary: "var(--body)",
    textTertiary: "var(--muted)",
    accent: "var(--primary)",
    accentHover: "var(--primary-active)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--error)",
    dangerBg: "var(--brand-coral)",
    dangerBorder: "var(--brand-coral)",
    brandPink: "var(--brand-pink)",
    brandTeal: "var(--brand-teal)",
    brandLavender: "var(--brand-lavender)",
    brandPeach: "var(--brand-peach)",
    brandOchre: "var(--brand-ochre)",
    transparent: "transparent",
  },
  typography: {
    fontFamily: '"Noto Sans JP", system-ui, -apple-system, sans-serif',
    fontDisplay: '"Noto Sans JP", sans-serif', 
    fontMono: '"JetBrains Mono", "Fira Code", "Roboto Mono", monospace',
    sizes: {
      xs: 12, // Caption
      sm: 14, // Body
      md: 16, // Body-md
      lg: 18, // Title-sm
      xl: 24, // Heading-H3
      h3: 24, 
      h2: 34, 
      h1: 40, 
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 500, // freee uses 500 for headings
      bold: 700, 
      extrabold: 700,
    },
  },
  spacing: {
    zero: 0,
    xs: 4,   // XSmall
    sm: 8,   // Small
    md: 16,  // Basic
    lg: 24,  // Large
    xl: 32,  // XLarge
    xxl: 48, // XXLarge
    xxxl: 64, 
    huge: 80,
    massive: 96,
    giant: 120,
  },
  borderRadius: {
    sm: 4,  // MiniPadding
    md: 8,  // Base
    lg: 12, // Card
    xl: 16, // Floating
    full: 9999,
  },
  shadows: {
    none: "none",
    subtle: "var(--shadow-card)",
    glow: "0 0 0 2px var(--primary)", 
  },
};

