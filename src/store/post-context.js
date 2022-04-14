import { createContext, useContext } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
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
    
    const createPostHandler = (file, caption, userId) => {
        const postRef = ref(storage, `posts/${userId}/${uniqueId}`);

        uploadBytes(postRef, file).then((snapshot) => {
            console.log('Uploaded file!');
        });

        setDoc(doc(firestoreDB, `users/${userId}/posts/${uniqueId}`), {
            postId: uniqueId,
            userId: userId,
            username: userCtx.user.username,
            caption: caption,
            likes: [],
            comments: [],
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