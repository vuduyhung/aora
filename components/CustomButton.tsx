import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles = '',
    isLoading = false
}: {
    title: string;
    handlePress: () => void;
    containerStyles: string;
    textStyles?: string;
    isLoading?: boolean;
}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`min-h-[62px] items-center justify-center rounded-xl bg-secondary ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
            <Text
                className={`font-psemibold text-lg text-primary ${textStyles}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
