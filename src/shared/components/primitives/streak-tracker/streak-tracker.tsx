import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/theme';
import { AppText } from '../../themed/app-text';

export interface StreakTrackerProps {
    streak: number;
    totalDays?: number;
    style?: any;
}

const DEFAULT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const StreakTracker: React.FC<StreakTrackerProps> = ({
    streak,
    totalDays = 7,
    style,
}) => {
    const { colors } = useTheme();

    const days = DEFAULT_DAYS.slice(0, totalDays);

    return (
        <View style={[styles.container, style]}>
            {days.map((day, index) => {
                const filled = index < streak;
                const isCurrent = index === streak;
                return (
                    <View key={index} style={styles.dayItem}>
                        {filled ? (
                            <View style={[styles.circle, { backgroundColor: colors.white }]}>
                                <Ionicons name="checkmark" size={10} color={colors.primary} />
                            </View>
                        ) : isCurrent ? (
                            <View style={[styles.circle, styles.activeCircle, { borderColor: colors.white }]}>
                                <View style={[styles.dot, { backgroundColor: colors.white }]} />
                            </View>
                        ) : (
                            <View style={[styles.circle, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                        )}
                        <View style={[styles.labelContainer, filled && { backgroundColor: colors.primary }]}>
                            <AppText variant="caption" style={[styles.label, { color: filled ? colors.white : colors.textSecondary }]}>
                                {day}
                            </AppText>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
    },
    dayItem: {
        alignItems: 'center',
        gap: 4,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCircle: {
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    labelContainer: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
    },
});
