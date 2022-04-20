import { useContext, useState, useEffect } from 'react';

import { doc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { auth, firestoreDB, storage } from '../../../firebase/firebase';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, deleteObject } from 'firebase/storage';

import { UserContext } from '../../../store/user-context';
import { AuthContext } from '../../../store/auth-context';
import BackButton from '../../UI/BackButton';
import Button from '../../UI/Button';
import classes from './ProfileSettings.module.css';
import ProfilePicture from '../../UI/ProfilePicture';
import LoadingSpinner from '../../UI/LoadingSpinner';

const ProfileSettings = () => {
    const { authCtx } = useContext(AuthContext);
    const { userCtx } = useContext(UserContext);
    const user = userCtx.user;
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        if (user.username) {
            setUserId(user.userId);
            setName(user.name);
            setUsername(user.username);
            setWebsite(user.website);
            setBio(user.bio);
            setEmail(user.email);
        }
    }, [user]);

    const profilePictureOnChangeHandler = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    const nameOnChangeHandler = (event) => {
        setName(event.target.value);
    };

    const usernameOnChangeHandler = (event) => {
        setUsername(event.target.value);
    };

    const websiteOnChangeHandler = (event) => {
        setWebsite(event.target.value);
    };

    const bioOnChangeHandler = (event) => {
        setBio(event.target.value);
    };

    const emailOnChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    const passwordOnChangeHandler = (event) => {
        setPassword(event.target.value);
    };

    const confirmPasswordOnChangeHandler = (event) => {
        setConfirmPassword(event.target.value);
    };

    const currentPasswordOnChangeHandler = (event) => {
        setCurrentPassword(event.target.value);
    };

    const reAuthenticateUser = async () => {
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
        );
    };

    const updateProfile = async () => {
        setIsLoading(true);

        reAuthenticateUser();

        const userRef = doc(firestoreDB, 'users', user.userId);
        await updateDoc(userRef, {
            name: name,
            username: username,
            website: website,
            bio: bio,
            // email: email,
        });

        if (email !== user.email) {
            updateEmail(auth.currentUser, email).then(() => {
                console.log('Email updated!');
            }).catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });

            await updateDoc(userRef, {
                email: email
            });
        };

        if (password && (password === confirmPassword)) {
            updatePassword(auth.currentUser, password).then(() => {
                console.log('Password updated!');
            }).catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
        };

        if (profilePicture) {
            const profilePictureRef = ref(storage, `users/profilePictures/${user.userId}`);
            uploadBytes(profilePictureRef, profilePicture).then((snapshot) => {
                console.log('Profile picture uploaded!');
            });
        };

        setIsLoading(false);
    };

    useEffect(() => {
        const arr = [];
        const fetchdoc = async () => {
        const querySnapshot = await getDocs(collection(firestoreDB, `users/${user.userId}/posts`));

        querySnapshot.forEach((doc) => {
            arr.push(doc.data());
        });
        console.log(arr);
        }
        fetchdoc();
    }, []);

    const deleteAccount = async (event) => {
        event.preventDefault();

        reAuthenticateUser();

        // Delete from storage
        if (user.posts.length !== 0) {
            user.posts.forEach((post) => {
                const postRef = ref(storage, `posts/${post.postId}`);
                deleteObject(postRef).then(() => {
                    console.log('File deleted successfully');
                }).catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                });
            });
        };

        const profilePictureRef = ref(storage, `users/profilePictures/${user.userId}`);
        if (profilePictureRef) {
            deleteObject(profilePictureRef).then(() => {
                console.log('Profile picture deleted successfully!');
            }).catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
        };

        // Delete from database
        await deleteDoc(doc(firestoreDB, 'users', user.userId));
        
        // Delete user
        deleteUser(auth.currentUser).then( async () => {
            console.log('Account deleted!');
            authCtx.logout();
        }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
        });
    };

    const removeProfilePicture = async (event) => {
        event.preventDefault();

        const profilePictureRef = ref(storage, `users/${user.userId}/profilePicture`);
        deleteObject(profilePictureRef).then(() => {
            console.log('Profile picture deleted!');
        }).catch((error) => {
            console.log(error.message);
        });
    };

    const logoutHandler = () => {
        authCtx.logout(); 
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        updateProfile();
    };

    return (
        <div className={classes.container}>
            <header className={classes.header}>
                <BackButton />
                <h2>Edit profile</h2>
                <Button 
                    className={classes.logout}
                    onClick={logoutHandler}
                >
                    Logout
                </Button>
            </header>
            <form 
                className={classes.form}
                onSubmit={onSubmitHandler}
            >
                <div className={classes['input-container']}>
                    <ProfilePicture 
                        className={classes.picture}
                        userId={userId}
                        size={'large'}
                    />
                    <button 
                        className={classes.remove}
                        onClick={removeProfilePicture}
                    >
                        Remove
                    </button>
                    <label htmlFor='profile-picture'>Profile picture</label>
                    <input 
                        id='profile-picture' 
                        type='file' 
                        name='profile-picture'
                        onChange={profilePictureOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='name'>Name</label>
                    <input 
                        id='name' 
                        type='text' 
                        name='name' 
                        placeholder='Name' 
                        value={name}
                        onChange={nameOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='username'>Username *</label>
                    <input 
                        id='username' 
                        type='text' 
                        name='username' 
                        placeholder='Username' 
                        value={username}
                        onChange={usernameOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='website'>Website</label>
                    <input 
                        id='website' 
                        type='text' 
                        name='website' 
                        placeholder='Website' 
                        value={website}
                        onChange={websiteOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='bio'>Bio</label>
                    <textarea 
                        id='bio' 
                        type='text' 
                        name='bio' 
                        placeholder='Bio' 
                        value={bio}
                        onChange={bioOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='email'>Email *</label>
                    <input 
                        id='email' 
                        type='text' 
                        name='email' 
                        placeholder='Email' 
                        value={email}
                        onChange={emailOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='password'>Change Password</label>
                    <input 
                        id='password' 
                        type='password' 
                        name='password' 
                        placeholder='New password' 
                        value={password}
                        onChange={passwordOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='confirm-password'>Confirm Password</label>
                    <input 
                        id='confirm-password' 
                        type='password' 
                        name='confirm-password' 
                        placeholder='Confirm password' 
                        value={confirmPassword}
                        onChange={confirmPasswordOnChangeHandler}
                    />
                </div>
                <div className={classes['input-container']}>
                    <label htmlFor='current-password'>Current Password *</label>
                    <input 
                        id='current-password' 
                        type='password' 
                        name='current-password' 
                        placeholder='Current password' 
                        value={currentPassword}
                        onChange={currentPasswordOnChangeHandler}
                    />
                </div>
                {!isLoading &&
                    <Button>Save</Button>
                }
                {!isLoading && 
                    <button 
                        className={classes.delete}
                        onClick={deleteAccount}
                    >
                        Delete account
                    </button>
                }
                {isLoading &&
                    <LoadingSpinner />
                }
            </form>
        </div>
    );
};

export default ProfileSettings;