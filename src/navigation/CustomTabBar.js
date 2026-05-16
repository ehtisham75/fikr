import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ROUTES from '../utils/routes';
import { AppIcon } from '../components';
import { useTheme } from '@react-navigation/native';
import { Fonts, icon } from '../theme/sizeMatter';

const icons = {
    [ROUTES.HOME]: { default: 'List', focused: 'List' },
    [ROUTES.BUDGET]: { default: 'Receipt', focused: 'Receipt' },
    [ROUTES.SETTINGS]: { default: 'Bolt', focused: 'Bolt' },
};

export default function CustomTabBar({ state, descriptors, navigation }) {
    const { colors } = useTheme();

    return (
        <View style={[styles.wrapper,
        Platform.OS === 'ios' && {
            marginBottom: 20,
        }]}>
            <View style={[styles.container,
            { backgroundColor: colors.card }
            ]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const iconName = icons[route.name]?.default;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={[styles.tabItem]}
                            activeOpacity={0.8}
                        >
                            <AppIcon name={iconName} size={icon(20)} color={isFocused ? colors.primary : colors.text} />

                            <Text style={[styles.label, { color: isFocused ? colors.primary : colors.text }]}>
                                {route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 18,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    label: {
        fontSize: Fonts.size.small,
        fontWeight: '600',
        marginLeft: 5,
        marginTop: 5
    },
});
