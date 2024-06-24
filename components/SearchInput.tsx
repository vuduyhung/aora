import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import { icons } from '@/constants';

const SearchInput = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}: {
    title: string;
    value: string;
    placeholder?: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className='flex h-16 w-full flex-row items-center space-x-4 rounded-2xl border-2 border-black-200 bg-black-100 px-4 focus:border-secondary'>
            <TextInput
                className='mt-0.5 flex-1 font-pregular text-base text-white'
                value={value}
                placeholder={placeholder}
                placeholderTextColor='#CDCDE0'
                onChangeText={handleChangeText}
            />

            <TouchableOpacity>
                <Image
                    source={icons.search}
                    className='h-5 w-5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;
