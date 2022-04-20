import { Fragment, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../../firebase/firebase';

import { UserContext } from '../../store/user-context';
import { ModalContext } from '../../store/modal-context';
import ProfilePicture from '../UI/ProfilePicture';
import Button from '../UI/Button';
import classes from './ProfileDetails.module.css';
import UsersModalContent from '../Modal/Content/UsersModalContent';

const ProfileDetails = () => {
    const [userData, setUserData] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const { userId } = useParams();
    const { userCtx } = useContext(UserContext);
    const currentUser = userCtx.user;
    const { modalCtx } = useContext(ModalContext);

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
    }, [userId, isFollowing, userData.following, userData.followers]);

    useEffect(() => {
        if (userData.followers?.includes(currentUser.userId)) {
            setIsFollowing(true);
        }
    }, [userData]);

    const followHandler = async () => {
        await userCtx.follow(userId);
        setIsFollowing(true);
    };

    const unfollowHandler = async () => {
        await userCtx.unfollow(userId);
        setIsFollowing(false);
    };

    const openFollowersHandler = () => {
        modalCtx.modalHandler(
            <UsersModalContent 
                users={userData.followers}
                username={userData.username}
                category={'Followers'}
            />
        );
    };

    const openFollowingHandler = () => {
        modalCtx.modalHandler(
            <UsersModalContent 
                users={userData.following} 
                username={userData.username} 
                category={'Following'} 
            />
        );
    };
    
    return (
        <Fragment>
            <header className={classes['user-header']}>
                <div className={classes['picture-container']}>
                    <button>
                        <ProfilePicture 
                            userId={userId}
                            size={'large'}
                        />
                    </button>
                </div>
                <div className={classes.details}>
                    <div className={classes.top}>
                        <h2>{userData.username}</h2>
                        {userId === currentUser.userId &&
                            <Link to='/profile/settings'>
                                <Button outline={true}>
                                        Edit
                                </Button>
                            </Link>
                        }
                        {userId !== currentUser.userId && !isFollowing &&
                            <Button 
                                onClick={followHandler}>
                                    Follow
                            </Button>
                        }
                        {userId !== currentUser.userId && isFollowing &&
                            <Button 
                                outline={true}
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
                            <li 
                                className={classes.clickable} 
                                onClick={openFollowersHandler}
                            >
                                <span>{userData.followers ? userData.followers.length : 0}</span>
                                <span>Followers</span>
                            </li>
                            <li 
                                className={classes.clickable} 
                                onClick={openFollowingHandler}
                            >
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
        </Fragment>
    );
};

export default ProfileDetails;