import { createContext, useContext } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
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
            // Uploaded
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
            
            posts.forEach((post) => {
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

            posts.forEach((post) => {
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

            posts.forEach((post) => {
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
        const currentUserRef = doc(firestoreDB, 'users', currentUser.userId);
        const updatedPosts = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.forEach((post) => {
                if (post.postId === postId) {
                    post.likes.push(currentUserId);
                    updatedPosts.push(post);
                } else {
                    updatedPosts.push(post);
                };
            });

            await updateDoc(postOwnerRef, {
                posts: updatedPosts
            });

            await updateDoc(currentUserRef, {
                likedPosts: arrayUnion({
                    postOwnerId: postOwnerId,
                    postId: postId
                })
            })
        };
    };

    const removeLikeHandler = async (postOwnerId, postId, currentUserId) => {
        const postOwnerRef = doc(firestoreDB, 'users', postOwnerId);
        const postOwnerSnapshot = await getDoc(postOwnerRef);
        const currentUserRef = doc(firestoreDB, 'users', currentUser.userId);
        const currentUserSnapshot = await getDoc(currentUserRef);
        const updatedPosts = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.forEach((post) => {
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
            });
        }; 

        if (currentUserSnapshot.exists()) {
            const likedPosts = currentUserSnapshot.data().likedPosts;
            const filteredLikedPosts = likedPosts.filter(likedPost => likedPost.postId !== postId);

            await updateDoc(currentUserRef, {
                likedPosts: filteredLikedPosts
            });
        }
    };

    const deletePostHandler = async (postId) => {
        const userRef = doc(firestoreDB, 'users', currentUser.userId);
        const userSnapshot = await getDoc(userRef);
        const updatedPosts = [];

        if (userSnapshot.exists()) {
            const posts = userSnapshot.data().posts;
            posts.forEach((post) => {
                if (post.postId !== postId) {
                    updatedPosts.push(post);
                }
            })

            await updateDoc(userRef, {
                posts: updatedPosts
            })
        };
    };

    const getRealtimeLikesHandler = async (postOwnerId, postId) => {
        const postOwnerRef = doc(firestoreDB, 'users', postOwnerId);
        const postOwnerSnapshot = await getDoc(postOwnerRef);
        let postLikes = [];

        if (postOwnerSnapshot.exists()) {
            const posts = postOwnerSnapshot.data().posts;

            posts.forEach((post) => {
                if (post.postId === postId) {
                    postLikes = post.likes;
                };
            });
            
            return postLikes;
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
        getRealtimeLikes: getRealtimeLikesHandler,
    };
    
    return (
        <PostContext.Provider value={{postCtx}}>
            {props.children}
        </PostContext.Provider>
    );
}