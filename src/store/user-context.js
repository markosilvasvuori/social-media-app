import { createContext, useEffect, useState } from 'react';
import { auth, firestoreDB } from '../firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const UserContext = createContext('');

export const UserProvider = (props) => {
    const [user, setUser] = useState(null);
    const [updateProfilePicture, setUpdateProfilePicture] = useState(false);

    // If user is already logged in, restore user data from localStorage
    if (!user) {
        const storedUserData = localStorage.getItem('user');
        
        if (storedUserData) {
            setUser(storedUserData);
        }
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

    // Remove deleted accounts from followers/following
    useEffect(() => {
        if (user?.followers?.length || user?.following?.length) {
            checkForDeletedUsers();
        }
    }, [user]);

    const checkForDeletedUsers = () => {
        const currentUserRef = doc(firestoreDB, 'users', user.userId);

        user.following.map(async (user) => {
            const userRef = doc(firestoreDB, 'users', user);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                // User exists
            } else {
                await updateDoc(currentUserRef, {
                    following: arrayRemove(user)
                });
            };
        });

        user.followers.map(async (user) => {
            const userRef = doc(firestoreDB, 'users', user);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                // User exists
            } else {
                await updateDoc(currentUserRef, {
                    followers: arrayRemove(user)
                });
            };
        });
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

    const updateProfilePictureOnChange = () => {
        setUpdateProfilePicture(!updateProfilePicture);
    };

    const userCtx = {
        getUserData: getUserData,
        follow: followHandler,
        unfollow: unfollowHandler,
        updateProfilePicture: updateProfilePictureOnChange,
        user: user,
    };

    return (
        <UserContext.Provider value={{userCtx}}>
            {props.children}
        </UserContext.Provider>
    );
};