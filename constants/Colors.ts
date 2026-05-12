/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2E7D32';
const tintColorDark = '#A5D6A7';

export const Colors = {
  light: {
    text: '#1B5E20',
    background: '#F1F8E9',
    tint: tintColorLight,
    icon: '#4CAF50',
    tabIconDefault: '#81C784',
    tabIconSelected: tintColorLight,
    card: 'rgba(255, 255, 255, 0.85)',
    border: '#C8E6C9',
    glass: 'rgba(255, 255, 255, 0.7)',
    primary: '#2E7D32',
    secondary: '#81C784',
    accent: '#F57C00', // For alerts/highlights
    danger: '#D32F2F',
  },
  dark: {
    text: '#E8F5E9',
    background: '#121212', // Pure dark background
    tint: tintColorDark,
    icon: '#A5D6A7',
    tabIconDefault: '#66BB6A',
    tabIconSelected: tintColorDark,
    card: 'rgba(30, 30, 30, 0.85)',
    border: '#2E7D32',
    glass: 'rgba(20, 20, 20, 0.7)',
    primary: '#4CAF50',
    secondary: '#2E7D32',
    accent: '#FFB74D',
    danger: '#EF5350',
  },
};
