import { createContext, useEffect, useState } from 'react';
import { auth, firestoreDB } from '../firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const UserContext = createContext('');

export const UserProvider = (props) => {
    const [user, setUser] = useState(null);

    // If user is already logged in, restore user data from localStorage
    if (!user) {
        const storedUserData = localStorage.getItem('user');
        setUser(storedUserData);
    };

    // Get current user's data
    const getUserData = async () => {
        const user = auth.currentUser;
        const docRef = doc(firestoreDB, 'users', user.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            setUser(docSnapshot.data());
            localStorage.setItem('user', docSnapshot.data());
        } else {
            console.log('No such document!');
        }
    };

    const updateUserData = async (currentUser) => {
        const docSnapshot = await getDoc(currentUser);
        if (docSnapshot.exists()) {
            setUser(docSnapshot.data());
            localStorage.setItem('user', docSnapshot.data());
        };
    };

    const followHandler = async (userToFollowId) => {
        const currentUserRef = doc(firestoreDB, 'users', user.userId);
        const userToFollowRef = doc(firestoreDB, 'users', userToFollowId);

        await updateDoc(currentUserRef, {
            following: arrayUnion(userToFollowId)
        });

        await updateDoc(userToFollowRef, {
            followers: arrayUnion(user.userId)
        });

        updateUserData(currentUserRef);
    };

    const unfollowHandler = async (userToUnfollowId) => {
        const currentUserRef = doc(firestoreDB, 'users', user.userId);
        const userToUnfollowRef = doc(firestoreDB, 'users', userToUnfollowId);

        await updateDoc(currentUserRef, {
            following: arrayRemove(userToUnfollowId)
        });

        await updateDoc(userToUnfollowRef, {
            followers: arrayRemove(user.userId)
        });

        updateUserData(currentUserRef);
    };

    const userCtx = {
        getUserData: getUserData,
        follow: followHandler,
        unfollow: unfollowHandler,
        user: user,
    };

    return (
        <UserContext.Provider value={{userCtx}}>
            {props.children}
        </UserContext.Provider>
    );
};