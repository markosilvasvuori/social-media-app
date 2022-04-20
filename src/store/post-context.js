import { createContext, useContext } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { storage, firestoreDB } from '../firebase/firebase';

import { UserContext } from './user-context';

export const PostContext = createContext({
    createPost: () => {},
    editPost: () => {},
    deletePost: () => {},
});

export const PostProvider = (props) => {
    const {userCtx} = useContext(UserContext);

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
    };

    const postCtx = {
        createPost: createPostHandler,
        // editPost: editPostHandler,
        // deletePost: deletePostHandler,
    };
    
    return (
        <PostContext.Provider value={{postCtx}}>
            {props.children}
        </PostContext.Provider>
    );
}