import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/theme';
import { AppText } from '../../themed/app-text';

export interface KpiStat {
    label: string;
    value: string | number;
    icon?: string;
    trend?: 'up' | 'down' | 'flat';
}

export interface KpiStatRowProps {
    stats: KpiStat[];
    style?: any;
}

export const KpiStatRow: React.FC<KpiStatRowProps> = ({ stats, style }) => {
    const { colors } = useTheme();

    const getTrendColor = (trend?: string) => {
        switch (trend) {
            case 'up':
                return colors.success;
            case 'down':
                return colors.error;
            default:
                return colors.textSecondary;
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.container, style]}
        >
            {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                    <View style={styles.statItem}>
                        {stat.icon && (
                            <View style={[styles.iconBadge, { backgroundColor: colors.primary + '18' }]}>
                                <Ionicons name={stat.icon as any} size={16} color={colors.primary} />
                            </View>
                        )}
                        <AppText variant="headlineSmall" style={[styles.value, { color: colors.text }]}>
                            {stat.value}
                        </AppText>
                        <AppText variant="bodySmall" style={[styles.label, { color: colors.text }]}>
                            {stat.label}
                        </AppText>
                        {stat.trend && (
                            <AppText variant="caption" style={{ color: getTrendColor(stat.trend) }}>
                                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '—'}
                            </AppText>
                        )}
                    </View>
                    {index < stats.length - 1 && (
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    )}
                </React.Fragment>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    statItem: {
        minWidth: 84,
        alignItems: 'flex-start',
        gap: 4,
    },
    iconBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    value: {
        fontWeight: '700',
        fontSize: 16,
    },
    label: {
        fontWeight: '700',
        fontSize: 10,
    },
    divider: {
        width: 1,
        height: '75%',
        marginHorizontal: 12,
    },
});
