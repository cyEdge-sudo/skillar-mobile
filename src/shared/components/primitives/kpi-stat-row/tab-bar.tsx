import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme';
import { AppText } from '../../themed/app-text';

export interface Tab {
    key: string;
    label: string;
    icon?: string;
    badge?: number;
}

export interface TabBarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (key: string) => void;
    style?: any;
}

export const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTab,
    onTabChange,
    style,
}) => {
    const { colors } = useTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.container, style]}
        >
            {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onTabChange(tab.key)}
                        style={[
                            styles.tab,
                            {
                                backgroundColor: isActive ? colors.primary : colors.surfaceVariant,
                                borderColor: isActive ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <AppText
                            variant="labelMedium"
                            style={{ color: isActive ? colors.white : colors.textSecondary }}
                        >
                            {tab.label}
                        </AppText>
                        {tab.badge != null && tab.badge > 0 && (
                            <View
                                style={[styles.badge, { backgroundColor: isActive ? colors.white : colors.primary }]}
                            >
                                <AppText variant="caption" style={{ color: isActive ? colors.primary : colors.white }}>
                                    {tab.badge}
                                </AppText>
                            </View>
                        )}
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        gap: 6,
    },
    badge: {
        borderRadius: 999,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});
