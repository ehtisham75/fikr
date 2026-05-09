const sharedColors = {
    primary: '#A78BFA',
    secondary: '#1c1c1e',
    accent: '#ff4081',
    error: '#ff0000',
    warning: '#ffa500',
    success: '#4caf50',
    transparent: 'transparent',
    purple: {
        purple1: '#A78BFA',
        purple2: '#8688eeff',
        purple3: '#6366F1',
        purple4: '#8b5cf6',
    },
    bg: '#A78BFA',
    shadow: '#7C3AED',
    white: '#ffffff',
    black: '#000000',
    black40: 'rgba(17, 17, 17, .4)',
    black60: 'rgba(17, 17, 17, .6)',
    black80: 'rgba(17, 17, 17, .8)',
};

export const LightThemeColors = {
    ...sharedColors,
    background: '#ffffff',
    card: '#ffffff',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
};

export const DarkThemeColors = {
    ...sharedColors,
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    border: '#374151',
};

// Kept for backward compatibility
const COLORS = {
    ...sharedColors,
    text: {
        black: '#111827',
        black2: '#333333',
        gray: '#6B7280',
        white: '#ffffff',
    },
    border: {
        gray: '#374151',
        lightGray: '#E5E7EB',
    },
};

export default COLORS;