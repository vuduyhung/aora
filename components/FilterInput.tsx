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
import EventBus from '@/lib/EventBus';
import { eventbus } from '@/constants';

const FilterInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');

    return (
        <View className='flex h-16 w-full flex-row items-center space-x-4 rounded-2xl border-2 border-black-200 bg-black-100 px-4 focus:border-secondary'>
            <TextInput
                className='mt-0.5 flex-1 font-pregular text-base text-white'
                value={query}
                placeholder='Filter for video topics'
                placeholderTextColor='#CDCDE0'
                onChangeText={(e) => setQuery(e)}
            />

            <TouchableOpacity
                onPress={() => {
                    // if (!query) {
                    //     return Alert.alert(
                    //         'Missing query',
                    //         'Please enter a query to search'
                    //     );
                    // }

                    // router.setParams({ query });
                    EventBus.publish(eventbus.FILTER_BOOKMARK, query);

                    // if (pathname.startsWith('/search')) {
                    //     router.setParams({ query });
                    // } else {
                    //     router.push(`/search/${query}`);
                    // }
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

export default FilterInput;
