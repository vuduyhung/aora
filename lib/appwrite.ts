import {
    Account,
    Avatars,
    Client,
    Databases,
    Storage,
    ID,
    Query,
    ImageGravity
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
const storage = new Storage(client);

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
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')]
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

export const updatePostLikes = async (postId, userId, liked) => {
    try {
        // console.log(`postId: ${postId}, userId: ${userId}, liked: ${liked}`);
        const post = await databases.getDocument(
            config.databaseId,
            config.videoCollectionId,
            postId
        );

        let newlikedUsers = post.likedUsers || [];
        if (liked) {
            newlikedUsers.push(userId);
        } else {
            newlikedUsers = newlikedUsers.filter((e) => e.$id !== userId);
        }

        const result = await databases.updateDocument(
            config.databaseId,
            config.videoCollectionId,
            postId,
            {
                likedUsers: newlikedUsers
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

export const getLikedPosts = async (query, userId) => {
    try {
        // if (!query) query = '';
        // console.log(`query: ${query}, userId: ${userId}`);

        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            query ? [Query.search('title', query)] : []
        );

        const result = posts.documents.filter(
            (e) =>
                e.likedUsers &&
                e.likedUsers.filter((e) => e.$id === userId).length > 0
        );
        // console.log('result: ', result);

        return result;
    } catch (error) {
        throw error;
    }
};

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(config.storageId, fileId);
        } else if (type === 'thumbnail') {
            fileUrl = storage.getFilePreview(
                config.storageId,
                fileId,
                2000,
                2000,
                ImageGravity.Top,
                100
            );
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw new Error('No file found');

        return fileUrl;
    } catch (error) {
        throw error;
    }
};

export const uploadFile = async (file, type) => {
    if (!file) throw new Error('No file provided');

    // const { mimeType, ...rest } = file;
    // const asset = { type: mimeType, ...rest };

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    };

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw error;
    }
};

export const createVideo = async (formData) => {
    try {
        // upload video and thumbnail to appwrite storage
        const [videoUrl, thumbnailUrl] = await Promise.all([
            uploadFile(formData.video, 'video'),
            uploadFile(formData.thumbnail, 'thumbnail')
        ]);

        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: formData.title,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                promt: formData.prompt,
                creator: formData.userId
            }
        );

        return newPost;
    } catch (error) {
        throw error;
    }
};
