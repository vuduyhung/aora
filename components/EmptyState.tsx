import { View, Text, Image } from 'react-native';
import React from 'react';

import { images } from '@/constants';
import CustomButton from './CustomButton';
import { router } from 'expo-router';

const EmptyState = ({
    title,
    subtitle
}: {
    title: string;
    subtitle: string;
}) => {
    return (
        <View className='items-center justify-center px-4'>
            <Image
                source={images.empty}
                className='h-[215px] w-[270px]'
                resizeMode='contain'
            />

            <Text className='font-psemibold text-2xl text-white'>{title}</Text>
            <Text className='font-pmedium text-sm text-gray-100'>
                {subtitle}
            </Text>

            <CustomButton
                title='Create a video'
                handlePress={() => router.push('/create')}
                containerStyles='w-full mt-5'
            />
        </View>
    );
};

export default EmptyState;
