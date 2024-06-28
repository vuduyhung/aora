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
import { useLocalSearchParams } from 'expo-router';
import FilterInput from '@/components/FilterInput';

const Bookmark = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();
    const { query } = useLocalSearchParams();
    const {
        data: bookmarkedPosts,
        isLoading,
        refetch
    } = useAppwrite(() => getLikedPosts(query, user.$id));

    useEffect(() => {
        refetch();
    }, [query]);

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
                        title='No videos found'
                        subtitle='Be the first one upload a video'
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Bookmark;
