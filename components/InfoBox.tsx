import { View, Text } from 'react-native';
import React from 'react';

interface InfoBoxProps {
    title: string | number;
    subtitle?: string;
    containerStyles?: string;
    titleStyles?: string;
}

const InfoBox = ({
    title,
    subtitle,
    containerStyles,
    titleStyles
}: InfoBoxProps) => {
    return (
        <View className={containerStyles}>
            <Text
                className={`text-center font-psemibold text-white ${titleStyles}`}
            >
                {title}
            </Text>
            <Text className='text-center font-pregular text-sm text-gray-100'>
                {subtitle}
            </Text>
        </View>
    );
};

export default InfoBox;
