import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '@/constants';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '@/lib/appwrite';

const SignUp = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createUser({
                email: form.email,
                password: form.password,
                username: form.username
            });

            router.replace('/home');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className='h-full bg-primary'>
            <ScrollView>
                <View className='my-6 min-h-[83vh] w-full justify-center px-4'>
                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className='h-[35px] w-[115px]'
                    />

                    <Text className='text-semibold mt-10 font-psemibold text-2xl text-white'>
                        Sign Up to Aora
                    </Text>

                    <FormField
                        title='Username'
                        value={form.username}
                        handleChangeText={(e) =>
                            setForm({ ...form, username: e })
                        }
                        otherStyles='mt-7'
                    />

                    <FormField
                        title='Email'
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles='mt-7'
                        keyboardType='email-address'
                    />

                    <FormField
                        title='Password'
                        value={form.password}
                        handleChangeText={(e: string) =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles='mt-7'
                    />

                    <CustomButton
                        title='Sign Up'
                        handlePress={submit}
                        containerStyles='mt-7'
                        isLoading={isSubmitting}
                    />

                    <View className='flex-row justify-center gap-2 pt-5'>
                        <Text className='font-pregular text-lg text-gray-100'>
                            Have an account already?
                        </Text>
                        <Link
                            href='/sign-in'
                            className='font-psemibold text-lg text-secondary'
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
