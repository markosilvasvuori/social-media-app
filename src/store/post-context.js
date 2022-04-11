import { createContext } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, firestoreDB } from '../firebase/firebase';

export const PostContext = createContext({
    createPost: () => {},
    editPost: () => {},
    deletePost: () => {},
});

export const PostProvider = (props) => {

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