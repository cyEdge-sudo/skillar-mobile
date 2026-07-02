import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme';
import { AppText } from '../../themed/app-text';

export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    titleStyle?: any;
    containerStyle?: any;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    action,
    titleStyle,
    containerStyle,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.textBlock}>
                <AppText variant="titleMedium" style={[{ color: colors.text }, titleStyle]}>
                    {title}
                </AppText>
                {subtitle && (
                    <AppText variant="bodySmall" color="textSecondary">
                        {subtitle}
                    </AppText>
                )}
            </View>
            {action && <View>{action}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textBlock: {
        flex: 1,
    },
});
