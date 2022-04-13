import { Fragment, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestoreDB } from '../../firebase/firebase';

import { UserContext } from '../../store/user-context';
import Button from '../UI/Button';
import classes from './ProfileDetails.module.css';

const ProfileDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const { userId } = useParams();
    const { userCtx } = useContext(UserContext);
    const currentUser = userCtx.user;

    useEffect(() => {
        const fetchUserData = async () => {
            const docRef = doc(firestoreDB, 'users', userId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                setUserData(docSnapshot.data())
            } else {
                console.log('User data not found');
            }
        };

        fetchUserData();
    }, [userId, isFollowing]);

    useEffect(() => {
        if (userData.followers?.includes(currentUser.userId)) {
            setIsFollowing(true);
        }

    }, [userData]);

    const openSettingsHandler = () => {
        setIsEditing(!isEditing);
    };

    const followHandler = async () => {
        const currentUserFollowingRef = doc(firestoreDB, 'users', currentUser.userId);
        const userFollowingRef = doc(firestoreDB, 'users', userId);

        await updateDoc(currentUserFollowingRef, {
            following: arrayUnion(userId)
        });

        await updateDoc(userFollowingRef, {
            followers: arrayUnion(currentUser.userId)
        });

        setIsFollowing(true);
    };

    const unfollowHandler = async () => {
        const currentUserFollowingRef = doc(firestoreDB, 'users', currentUser.userId);
        const userFollowingRef = doc(firestoreDB, 'users', userId);

        await updateDoc(currentUserFollowingRef, {
            following: arrayRemove(userId)
        });

        await updateDoc(userFollowingRef, {
            followers: arrayRemove(currentUser.userId)
        });

        setIsFollowing(false);
    };
    
    return (
        <Fragment>
            {!isEditing &&
                <header className={classes['user-header']}>
                    <div className={classes['picture-container']}>
                        <button>
                            <img 
                                className={classes.picture} 
                                src={userData.profilePicture} 
                                alt={userData.username} 
                            />
                        </button>
                    </div>
                    <div className={classes.details}>
                        <div className={classes.top}>
                            <h2>{userData.username}</h2>
                            {userId === currentUser.userId &&
                                <Button 
                                    onClick={openSettingsHandler}>
                                        Edit
                                </Button>
                            }
                            {userId !== currentUser.userId && !isFollowing &&
                                <Button 
                                    onClick={followHandler}>
                                        Follow
                                </Button>
                            }
                            {userId !== currentUser.userId && isFollowing &&
                                <Button 
                                    onClick={unfollowHandler}>
                                        Unfollow
                                </Button>
                            }
                        </div>
                        <div className={classes.middle}>
                            <ul>
                                <li>
                                    <span>{userData.posts ? userData.posts.length : 0}</span>
                                    <span>Posts</span>
                                </li>
                                <li>
                                    <span>{userData.followers ? userData.followers.length : 0}</span>
                                    <span>Followers</span>
                                </li>
                                <li>
                                    <span>{userData.following ? userData.following.length : 0}</span>
                                    <span>Following</span>
                                </li>
                            </ul>
                        </div>
                        <div className={classes.bottom}>
                            <span className={classes.name}>{userData.name}</span>
                            <span>{userData.bio}</span>
                            <span><a href={userData.website}>{userData.website}</a></span>
                        </div>
                    </div>
                </header>
            }
            {isEditing &&
                <div>
                    Settings
                </div>
            }
        </Fragment>
    );
};

export default ProfileDetails;