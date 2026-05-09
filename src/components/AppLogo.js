import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import COLORS from '../theme/colors';

const AppLogo = ({ size = 130, containerStyle = {} }) => {
    const iconSize = size * 0.55;

    return (
        <View style={[
            styles.logoInner,
            {
                width: size,
                height: size,
                borderRadius: size * 0.25
            },
            containerStyle
        ]}>
            <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none">
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="100" y2="100">
                        <Stop offset="0" stopColor={COLORS.primary} stopOpacity="1" />
                        <Stop offset="1" stopColor="#7C3AED" stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                {/* Sleek F monogram */}
                <Path
                    d="M30 85 V20 C30 14.477 34.477 10 40 10 H75 C80.523 10 85 14.477 85 20 C85 25.523 80.523 30 75 30 H50 V45 H70 C75.523 45 80 49.477 80 55 C80 60.523 75.523 65 70 65 H50 V85 C50 90.523 45.523 95 40 95 C34.477 95 30 90.523 30 85 Z"
                    fill="url(#grad)"
                />
                {/* Ascent/Mindfulness dot */}
                <Circle cx="70" cy="80" r="10" fill="#F59E0B" />
            </Svg>
        </View>
    );
};

export default AppLogo;

const styles = StyleSheet.create({
    logoInner: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 25,
            },
            android: {
                elevation: 4,
            },
        }),
    },
});