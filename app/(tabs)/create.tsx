import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import { ResizeMode, Video } from 'expo-av';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { createVideo } from '@/lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

const Create = () => {
    const { user } = useGlobalContext();

    const [form, setForm] = useState({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
    });
    const [uploading, setUploading] = useState(false);
    // const [status, requestPermission] = ImagePicker.useCameraPermissions();
    // const [status, requestPermission] =
    //     ImagePicker.useMediaLibraryPermissions();

    const openPicker = async (selectType: string) => {
        // const result = await DocumentPicker.getDocumentAsync({
        //     type:
        //         selectType === 'video'
        //             ? ['video/mp4', 'video/gif', 'video/mov']
        //             : ['image/png', 'image/jpeg', 'image/jpg']
        // });

        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
                selectType === 'video'
                    ? ImagePicker.MediaTypeOptions.Videos
                    : ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            if (selectType === 'video') {
                setForm({ ...form, video: result.assets[0] });
            }

            if (selectType === 'thumbnail') {
                setForm({ ...form, thumbnail: result.assets[0] });
            }
        }
    };

    const submit = async () => {
        if (!user) return;

        if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
            return Alert.alert('Error', 'Please fill all fields');
        }

        setUploading(true);
        try {
            // upload video and thumbnail to appwrite storage
            // save video title, prompt and thumbnail url to database
            await createVideo({ ...form, userId: user.$id });

            Alert.alert('Success', 'Video uploaded successfully');
            router.push('/home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setForm({ title: '', video: null, thumbnail: null, prompt: '' });
            setUploading(false);
        }
    };

    return (
        <SafeAreaView className='h-full bg-primary'>
            <ScrollView className='my-6 px-4'>
                <Text className='font-psemibold text-2xl text-white'>
                    Upload video
                </Text>

                <FormField
                    title='Video Title'
                    value={form.title}
                    placeholder='Give your video a catchy title...'
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles='mt-10'
                />

                <View className='mt-7 space-y-2'>
                    <Text className='font-pmedium text-base text-gray-100'>
                        Upload video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('video')}>
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className='h-64 w-full rounded-2xl'
                                // useNativeControls
                                resizeMode={ResizeMode.COVER}
                                // isLooping
                            />
                        ) : (
                            <View className='h-40 w-full items-center justify-center rounded-2xl bg-black-100 px-4'>
                                <View className='h-14 w-14 items-center justify-center border border-dashed border-secondary-100'>
                                    <Image
                                        source={icons.upload}
                                        resizeMode='contain'
                                        className='h-1/2 w-1/2'
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className='mt-7 space-y-2'>
                    <Text className='font-pmedium text-base text-gray-100'>
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('thumbnail')}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode='cover'
                                className='h-64 w-full rounded-2xl'
                            />
                        ) : (
                            <View className='h-16 w-full flex-row items-center justify-center space-x-2 rounded-2xl border-2 border-black-200 bg-black-100 px-4'>
                                <Image
                                    source={icons.upload}
                                    resizeMode='contain'
                                    className='h-5 w-5'
                                />
                                <Text className='font-pmedium text-sm text-gray-100'>
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title='AI Prompt'
                    value={form.prompt}
                    placeholder='The AI prompt of your video...'
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles='mt-7'
                />

                <CustomButton
                    title='Submit & Publish'
                    handlePress={submit}
                    containerStyles='mt-7'
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Create;
