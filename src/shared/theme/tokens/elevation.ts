import { Platform } from 'react-native';

export const elevation = {
    none: Platform.select({
        ios: {},
        android: { elevation: 0 },
        default: {},
    }),

    small: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        },
        android: { elevation: 2 },
        default: {},
    }),

    medium: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        android: { elevation: 4 },
        default: {},
    }),

    large: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        android: { elevation: 8 },
        default: {},
    }),

    extraLarge: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
        },
        android: { elevation: 16 },
        default: {},
    }),
} as const;
