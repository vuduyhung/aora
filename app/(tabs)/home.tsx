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
import Search from '../search/[query]';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import { getAllPosts } from '@/lib/appwrite';
import useAppwrite from '@/hooks/useAppwrite';
import VideoCard from '@/components/VideoCard';

const Home = () => {
    const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className='h-full bg-primary'>
            <FlatList
                data={posts?.documents ?? []}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className='my-6 space-y-6 px-4'>
                        <View className='mb-6 flex-row items-start justify-between'>
                            <View>
                                <Text className='font-pmedium text-sm text-gray-100'>
                                    Welcome back
                                </Text>
                                <Text className='font-psemibold text-2xl text-white'>
                                    Aora
                                </Text>
                            </View>

                            <View className='mt-1.5'>
                                <Image
                                    source={images.logoSmall}
                                    resizeMode='contain'
                                    className='h-10 w-9'
                                />
                            </View>
                        </View>

                        <SearchInput
                            title=''
                            value=''
                            placeholder='Search for a video topic'
                            handleChangeText={() => {}}
                        />

                        <View className='w-full flex-1 pb-8 pt-5'>
                            <Text className='mb-3 font-pregular text-lg text-gray-100'>
                                Latest Videos
                            </Text>

                            <Trending
                                posts={[{ id: 1 }, { id: 2 }, { id: 3 }] ?? []}
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title='No videos found'
                        subtitle='Be the first one upload a video'
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Home;
