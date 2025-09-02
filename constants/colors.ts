// basic design system
export const palette = {
  primary: {
    light: "#000000",
    dark: "#FFFFFF",
  },
  background: {
    light: "#FFFFFF",
    dark: "#000000",
  },
  selectedBorder: {
    light: "#000000",
    dark: "#FFFFFF",
  },
  surface: {
    light: "#F5F5F5",
    dark: "#1A1A1A",
  },
  text: {
    light: "#000000",
    dark: "#FFFFFF",
  },
  textSecondary: {
    light: "#666666",
    dark: "#CCCCCC",
  },
  border: {
    light: "#E0E0E0",
    dark: "#333333",
  },
  inactive: {
    light: "#999999",
    dark: "#888888",
  },
};

export const lightTheme = {
  primary: palette.primary.light,
  background: palette.background.light,
  surface: palette.surface.light,
  text: palette.text.light,
  textSecondary: palette.textSecondary.light,
  border: palette.border.light,
  inactive: palette.inactive.light,
  selectedBorder: palette.selectedBorder.light,
};

export const darkTheme = {
  primary: palette.primary.dark,
  background: palette.background.dark,
  surface: palette.surface.dark,
  text: palette.text.dark,
  textSecondary: palette.textSecondary.dark,
  border: palette.border.dark,
  inactive: palette.inactive.dark,
  selectedBorder: palette.selectedBorder.dark,
};
