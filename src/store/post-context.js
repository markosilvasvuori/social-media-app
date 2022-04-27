import { createContext, useContext } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { arrayUnion, collection, doc, getDoc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { storage, firestoreDB } from '../firebase/firebase';

import { UserContext } from './user-context';
import { ModalContext } from './modal-context';

export const PostContext = createContext({
    createPost: () => {},
    editPost: () => {},
    deletePost: () => {},
});

export const PostProvider = (props) => {
    const { userCtx } = useContext(UserContext);
    const { modalCtx } = useContext(ModalContext);
    const currentUser = userCtx.user;

    const generateUniqueId = () => {
        const dateString = Date.now().toString(36);
        const mathString = Math.random().toString(36).substring(2);
        return dateString + mathString;
    };
    const uniqueId = generateUniqueId();
    
    const createPostHandler = async (file, caption, userId) => {
        const postRef = ref(storage, `posts/${uniqueId}`);
        await uploadBytes(postRef, file).then((snapshot) => {
            console.log('Uploaded file!');
        });

        const userRef = doc(firestoreDB, 'users', userId);
        await updateDoc(userRef, {
            posts: arrayUnion({
                postId: uniqueId,
                userId: userId,
                username: userCtx.user.username,
                caption: caption,
                likes: [],
                comments: [],
            })
        });

        modalCtx.modalHandler();
    };

    const saveChangesHandler = async (postId, caption) => {
        const userRef = doc(firestoreDB, 'users', currentUser.userId);
        const userSnapshot = await getDoc(userRef);
        const updatedPosts = [];

        if (userSnapshot.exists()) {
            const posts = userSnapshot.data().posts;
            
            posts.map((post) => {
                if (post.postId === postId) {
                    post.caption = caption;
                    updatedPosts.push(post);
                } else {
                    updatedPosts.push(post);
                }
            });
            
            await updateDoc(userRef, {
                posts: updatedPosts
            });
        };
    };

    const deletePostHandler = async (postId) => {
        const userRef = doc(firestoreDB, 'users', currentUser.userId);
        const userSnapshot = await getDoc(userRef);
        const updatedPosts = [];

        if (userSnapshot.exists()) {
            const posts = userSnapshot.data().posts;
            posts.map((post) => {
                if (post.postId !== postId) {
                    updatedPosts.push(post);
                }
            })

            await updateDoc(userRef, {
                posts: updatedPosts
            })
        };
    };

    const postCtx = {
        createPost: createPostHandler,
        saveChanges: saveChangesHandler,
        deletePost: deletePostHandler,
    };
    
    return (
        <PostContext.Provider value={{postCtx}}>
            {props.children}
        </PostContext.Provider>
    );
}