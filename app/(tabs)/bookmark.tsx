import {
    View,
    Text,
    FlatList,
    Image,
    RefreshControl,
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import useAppwrite from '@/hooks/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getLikedPosts } from '@/lib/appwrite';
import { useLocalSearchParams, useSegments } from 'expo-router';
import FilterInput from '@/components/FilterInput';
import EventBus from '@/lib/EventBus';
import { eventbus } from '@/constants';

const Bookmark = () => {
    const segments = useSegments();
    const { user, setUser, setIsLogged } = useGlobalContext();
    // const { query } = useLocalSearchParams();

    // const {
    //     data: bookmarkedPosts,
    //     isLoading,
    //     refetch
    // } = useAppwrite(() => getLikedPosts(query, user.$id));

    // useEffect(() => {
    //     console.log('query change: ', query);
    //     _initData();
    // }, [query]);

    const [query, setQuery] = useState('');
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

    useEffect(() => {
        const fn = async (query: string) => {
            setQuery(query);
            // const data = await getLikedPosts(query, user.$id);
            // setBookmarkedPosts(data);
            _initData(query);
        };

        _initData(query);

        const subcriptor = EventBus.subscribe(eventbus.FILTER_BOOKMARK, fn);
        return () => subcriptor.unSubscribe();
    }, []);

    const _initData = async (query) => {
        const data = await getLikedPosts(query, user.$id);
        setBookmarkedPosts(data);
    };

    return (
        <SafeAreaView className='h-full bg-primary'>
            <FlatList
                data={bookmarkedPosts ?? []}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className='my-6 px-4'>
                        <Text className='font-psemibold text-2xl text-white'>
                            Bookmarked videos
                        </Text>

                        <View className='mb-8 mt-6'>
                            <FilterInput initialQuery={query} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title='No bookmark videos found'
                        subtitle='Let bookmark videos or be the first one upload a video'
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Bookmark;
