import { createContext, useContext } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { arrayUnion, collection, doc, getDoc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { storage, firestoreDB } from '../firebase/firebase';

import { UserContext } from './user-context';
import { ModalContext } from './modal-context';

export const PostContext = createContext({
    createPost: () => {},
    saveChanges: () => {},
    addComment: () => {},
    deleteComment: () => {},
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
                timestamp: Date.now().toString(),
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

    const addCommentHandler = async (postId, commenterId, postOwnerId, commenterUsername, comment) => {
        const postOwnerRef = doc(firestoreDB, 'users', postOwnerId);
        const postOwnerSnapshot = await getDoc(postOwnerRef);
        const updatedPosts = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.map((post) => {
                if (post.postId === postId) {
                    post.comments.push({
                        commentId: generateUniqueId(),
                        userId: commenterId,
                        username: commenterUsername,
                        comment: comment
                    });
                    updatedPosts.push(post);
                } else {
                    updatedPosts.push(post);
                };
            });

            await updateDoc(postOwnerRef, {
                posts: updatedPosts
            })
        };
    };

    const deleteCommentHandler = async (postOwnerId, postId, commentId) => {
        const postOwnerRef = doc(firestoreDB, 'users', postOwnerId);
        const postOwnerSnapshot = await getDoc(postOwnerRef);
        const updatedPosts = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.map((post) => {
                if (post.postId === postId) {
                    const comments = post.comments;
                    const filteredComments = comments.filter(comment => comment.commentId !== commentId);
                    post.comments = filteredComments;
                    updatedPosts.push(post);
                } else {
                    updatedPosts.push(post);
                };
            });

            await updateDoc(postOwnerRef, {
                posts: updatedPosts
            });
        };
    };

    const addLikeHandler = async (postOwnerId, postId, currentUserId) => {
        const postOwnerRef = doc(firestoreDB, 'users', postOwnerId);
        const postOwnerSnapshot = await getDoc(postOwnerRef);
        const updatedPosts = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.map((post) => {
                if (post.postId === postId) {
                    post.likes.push(currentUserId);
                    updatedPosts.push(post);
                    console.log('liked');
                } else {
                    updatedPosts.push(post);
                };
            });

            await updateDoc(postOwnerRef, {
                posts: updatedPosts
            })
        };
    };

    const removeLikeHandler = async (postOwnerId, postId, currentUserId) => {
        const postOwnerRef = doc(firestoreDB, 'users', postOwnerId);
        const postOwnerSnapshot = await getDoc(postOwnerRef);
        const updatedPosts = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.map((post) => {
                if (post.postId === postId) {
                    const likes = post.likes;
                    const filteredLikes = likes.filter(id => id !== currentUserId);
                    post.likes = filteredLikes;
                    updatedPosts.push(post);
                } else {
                    updatedPosts.push(post);
                };
            });

            await updateDoc(postOwnerRef, {
                posts: updatedPosts
            })
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
        addComment: addCommentHandler,
        addLike: addLikeHandler,
        removeLike: removeLikeHandler,
        deleteComment: deleteCommentHandler,
        deletePost: deletePostHandler,
    };
    
    return (
        <PostContext.Provider value={{postCtx}}>
            {props.children}
        </PostContext.Provider>
    );
}