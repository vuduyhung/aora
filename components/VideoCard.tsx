import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';
import { ResizeMode, Video } from 'expo-av';
import { useGlobalContext } from '@/context/GlobalProvider';
import { updatePostLikes } from '@/lib/appwrite';

const VideoCard = ({
    video: {
        $id,
        title,
        thumbnail,
        video,
        creator: { username, avatar },
        likedUsers
    }
}: {
    video: {
        $id: string;
        title: string;
        thumbnail: string;
        video: string;
        creator: {
            username: string;
            avatar: string;
        };
        likedUsers: [];
    };
}) => {
    const { user } = useGlobalContext();
    const [play, setPlay] = useState(false);
    const [liked, setLiked] = useState(
        user.$id && likedUsers.filter((e) => e.$id === user.$id).length > 0
            ? true
            : false
    );

    // TODO: need add an Event Bus to handle update likes event, make sure another components can receive event update
    const toggleLike = () => {
        // Implement like/unlike functionality here
        setLiked((prev) => !prev);

        updatePostLikes($id, user.$id, !liked);
    };

    return (
        <View className='mb-14 flex-col items-center px-4'>
            <View className='flex-row items-start gap-3'>
                <View className='flex-1 flex-row items-center justify-center'>
                    <View className='h-[46px] w-[46px] items-center justify-center rounded-lg border border-secondary px-0.5'>
                        <Image
                            source={{ uri: avatar }}
                            className='h-full w-full rounded-lg'
                            resizeMode='contain'
                        />
                    </View>

                    <View className='ml-3 flex-1 justify-center gap-y-1'>
                        <Text
                            className='font-psemibold text-sm text-white'
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        <Text className='font-pregular text-xs text-gray-100'>
                            {username}
                        </Text>
                    </View>
                </View>

                <View className='flex-row space-x-3 pt-2'>
                    <TouchableOpacity
                        className='items-center justify-center'
                        onPress={toggleLike}
                    >
                        <Image
                            source={icons.bookmark}
                            tintColor={liked ? '#ffa001' : '#cdcde0'}
                            className='h-5 w-5'
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    <Image
                        source={icons.menu}
                        className='h-5 w-5'
                        resizeMode='contain'
                    />
                </View>
            </View>

            {play ? (
                <Video
                    source={{ uri: video }}
                    className='roudned-xl mt-3 h-60 w-full'
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(playbackStatus) => {
                        if (
                            playbackStatus.didJustFinish &&
                            !playbackStatus.isLooping
                        )
                            setPlay(false);
                    }}
                />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    className='relative mt-3 h-60 w-full items-center justify-center rounded-xl'
                    onPress={() => setPlay(true)}
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className='mt-3 h-full w-full rounded-xl'
                        resizeMode='cover'
                    />
                    <Image
                        source={icons.play}
                        className='absolute h-12 w-12'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default VideoCard;
