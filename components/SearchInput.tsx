import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';

import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');

    return (
        <View className='flex h-16 w-full flex-row items-center space-x-4 rounded-2xl border-2 border-black-200 bg-black-100 px-4 focus:border-secondary'>
            <TextInput
                className='mt-0.5 flex-1 font-pregular text-base text-white'
                value={query}
                placeholder='Search for a video topic'
                placeholderTextColor='#CDCDE0'
                onChangeText={(e) => setQuery(e)}
            />

            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert(
                            'Missing query',
                            'Please enter a query to search'
                        );
                    }

                    if (pathname.startsWith('/search')) {
                        router.setParams({ query });
                    } else {
                        router.push(`/search/${query}`);
                    }
                }}
            >
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
