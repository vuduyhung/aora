import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons } from '@/constants';
import EmptyState from '@/components/EmptyState';
import { getUserPosts, signOut } from '@/lib/appwrite';
import useAppwrite from '@/hooks/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import InfoBox from '@/components/InfoBox';
import { router } from 'expo-router';

const Profile = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();
    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLogged(false);

        router.replace('/sign-in');
    };

    return (
        <SafeAreaView className='h-full bg-primary'>
            <FlatList
                data={posts ?? []}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className='mb-12 mt-6 w-full items-center justify-center px-4'>
                        <TouchableOpacity
                            className='mb-10 w-full items-end'
                            onPress={logout}
                        >
                            <Image
                                source={icons.logout}
                                className='h-6 w-6'
                                resizeMode='contain'
                            />
                        </TouchableOpacity>

                        <View className='h-16 w-16 items-center justify-center rounded-lg border border-secondary'>
                            <Image
                                source={{ uri: user?.avatar }}
                                className='h-[90%] w-[90%] rounded-lg'
                                resizeMode='cover'
                            />
                        </View>

                        <InfoBox
                            title={user?.username}
                            containerStyles='mt-5'
                            titleStyles='text-lg'
                        />

                        <View className='mt-5 flex-row'>
                            <InfoBox
                                title={posts.length || 0}
                                subtitle='Posts'
                                containerStyles='mr-10'
                                titleStyles='text-xl'
                            />
                            <InfoBox
                                title='2.3k'
                                subtitle='Followers'
                                titleStyles='text-xl'
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title='No videos found'
                        subtitle='for this search query'
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Profile;
