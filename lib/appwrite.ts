import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query
} from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.vimetech.aora',
    projectId: '66771497003e7f3870ce',
    databaseId: '667717a900358ee0ab79',
    userCollectionId: '66780310000169f3555e',
    videoCollectionId: '66780396003c404e9ab9',
    storageId: '667822800028975c3513'
};

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async ({
    email,
    password,
    username
}: {
    email: string;
    password: string;
    username: string;
}) => {
    try {
        // auth
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn({ email, password });

        // also create new user
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const signIn = async ({
    email,
    password
}: {
    email: string;
    password: string;
}) => {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        return session;
    } catch (error) {
        throw error;
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        throw error;
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        );

        return posts.documents;
    } catch (error) {
        throw error;
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        );

        return posts.documents;
    } catch (error) {
        throw error;
    }
};

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        );

        return posts.documents;
    } catch (error) {
        throw error;
    }
};

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', userId)]
        );

        return posts.documents;
    } catch (error) {
        throw error;
    }
};
