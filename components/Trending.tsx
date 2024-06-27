import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '@/constants';
import { Video, ResizeMode } from 'expo-av';

const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.1
    }
};

const zoomOut = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    }
};

const TrendingItem = ({ item, activeItem }) => {
    const [play, setPlay] = useState(false);

    return (
        <Animatable.View
            className='mr-5'
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    className='roudned-[35px] mt-3 h-52 w-52 bg-white/10'
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
                    className='relative items-center justify-center'
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                >
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className='my-5 h-72 w-52 overflow-hidden rounded-[35px] shadow-lg shadow-black/40'
                        resizeMethod='resize'
                    />
                    <Image
                        source={icons.play}
                        className='absolute h-12 w-12'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[0]);

    const viewableItemsChanges = ({ viewableItems }) => {
        if (viewableItems.length > 0) setActiveItem(viewableItems[0].key);
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem item={item} activeItem={activeItem} />
            )}
            onViewableItemsChanged={viewableItemsChanges}
            viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
            contentOffset={{ x: 170, y: 0 }}
            horizontal
        />
    );
};

export default Trending;
