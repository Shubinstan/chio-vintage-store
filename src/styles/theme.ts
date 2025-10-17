// Defining a vintage-style theme with warm, muted colors
export const lightTheme = {
  body: '#FDF6E3', // Creamy off-white background
  text: '#584232', // Dark brown, like coffee
  accent: '#A52A2A', // Burgundy accent
  cardBg: '#F5EFE1', // Slightly darker background for cards
};

// Описываем цвета для темной темы
export const darkTheme = {
  body: '#2C2B2A', // Dark, almost black background
  text: '#EAE0C8', // Light beige text
  accent: '#D2691E', // Chocolate or mustard accent
  cardBg: '#3E3C3A', // Card background for dark theme
};

// Exporting a type for the theme to ensure type safety in styled-components
export type Theme = typeof lightTheme;