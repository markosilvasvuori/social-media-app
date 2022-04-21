import { useContext, useState, useEffect } from 'react';

import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, firestoreDB, storage } from '../../../firebase/firebase';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, deleteObject } from 'firebase/storage';

import { UserContext } from '../../../store/user-context';
import { AuthContext } from '../../../store/auth-context';
import { ModalContext } from '../../../store/modal-context';
import BackButton from '../../UI/BackButton';
import Button from '../../UI/Button';
import classes from './ProfileSettings.module.css';
import ProfilePicture from '../../UI/ProfilePicture';
import LoadingSpinner from '../../UI/LoadingSpinner';
import ErrorMessage from '../../UI/ErrorMessage';
import ConfirmDeleteAccount from '../../Modal/Content/ConfirmDeleteAccount';

const ProfileSettings = () => {
    const { authCtx } = useContext(AuthContext);
    const { userCtx } = useContext(UserContext);
    const { modalCtx } = useContext(ModalContext);
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
    const [errors, setErrors] = useState({
        usernameError: false,
        emailError: false,
        passwordError: false,
        confirmPasswordError: false,
        passwordsMatchError: false,
        currentPasswordError: {
            error: false,
            message: ''
        }
    });

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
        setErrors((prevErrors) => ({
            ...prevErrors,
            currentPasswordError: {
                error: false,
                message: ''
            }
        }));

        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
        ).then(() => {
                updateProfile();
        }).catch((error) => {
            console.log(error.message);
            if (currentPassword === '') {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    currentPasswordError: {
                        error: true,
                        message: 'Please enter current password to save changes'
                    }
                }));
            };

            if (currentPassword !== '') {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    currentPasswordError: {
                        error: true,
                        message: 'Wrong password'
                    }
                }));
            };
        });
    };

    const validateForm = async () => {
        let formIsValid = true;
        setErrors({
            usernameError: false,
            emailError: false,
            passwordError: false,
            confirmPasswordError: false,
            passwordsMatchError: false,
            currentPasswordError: {
                error: false,
                message: ''
            }
        });

        if (username.trim() === '') {
            formIsValid = false;
            setErrors((prevErrors) => ({
                ...prevErrors,
                usernameError: true
            }));
        };

        if (!email.trim().includes('@')) {
            formIsValid = false;
            setErrors((prevErrors) => ({
                ...prevErrors,
                emailError: true
            }));
        };

        if (password) {
            if (password.trim().length < 6) {
                formIsValid = false;
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    passwordError: true
                }));
            };
        }

        if (confirmPassword.trim() === '' && password.trim().length >= 6) {
            formIsValid = false;
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPasswordError: true
            }));
        };

        if (password.trim().length >= 6 && confirmPassword.trim() !== '') {
            formIsValid = false;
            if (password !== confirmPassword) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    passwordsMatchError: true
                }));
            };
        };
        
        if (formIsValid) {
            reAuthenticateUser();
        }
    };

    const updateProfile = async () => {
        setIsLoading(true);

        // Update name, username, website and bio
        const userRef = doc(firestoreDB, 'users', user.userId);
        await updateDoc(userRef, {
            name: name,
            username: username,
            website: website,
            bio: bio,
        });

        // Update email if email was changed
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

        // Update password if password was changed
        if (password && (password === confirmPassword)) {
            updatePassword(auth.currentUser, password).then(() => {
                console.log('Password updated!');
            }).catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
        };

        // Update profile picture if profile picture was added
        if (profilePicture) {
            const profilePictureRef = ref(storage, `users/profilePictures/${user.userId}`);
            uploadBytes(profilePictureRef, profilePicture).then((snapshot) => {
                console.log('Profile picture uploaded!');
            });
        };

        setPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
        setIsLoading(false);
    };

    const confirmDeleteHandler = (event) => {
        event.preventDefault();
        modalCtx.modalHandler(<ConfirmDeleteAccount />);
    };

    const removeProfilePicture = async (event) => {
        event.preventDefault();

        const profilePictureRef = ref(storage, `users/profilePictures/${user.userId}`);
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
        validateForm();
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
                    {errors.usernameError &&
                        <ErrorMessage 
                            message={'Please enter username'}
                        />
                    }
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
                    {errors.emailError &&
                        <ErrorMessage 
                            message={'Please enter a valid email'}
                        />
                    }
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
                    {errors.passwordError &&
                        <ErrorMessage 
                            message={'Password must be at least 6 characters long'}
                        />
                    }
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
                    {errors.confirmPasswordError &&
                        <ErrorMessage 
                            message={'Confirm password'}
                        />
                    }
                    {errors.passwordsMatchError &&
                        <ErrorMessage 
                            message={'Passwords do not match'}
                        />
                    }
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
                    {errors.currentPasswordError.error &&
                        <ErrorMessage 
                            message={errors.currentPasswordError.message}
                        />
                    }
                </div>
                {!isLoading &&
                    <Button>Save</Button>
                }

                {errors.usernameError &&
                    <p>Please enter username</p>
                }
                {errors.emailError &&
                    <p>Please enter a valid email</p>
                }
                {errors.passwordError &&
                    <p>Password must be at least 6 characters long</p>
                }
                {errors.confirmPasswordError &&
                    <p>Confirm password</p>
                }
                {errors.passwordsMatchError &&
                    <p>Passwords do not match</p>
                }
                {errors.currentPasswordError.error &&
                    <p>{errors.currentPasswordError.message}</p>
                }

                {!isLoading && 
                    <button 
                        className={classes.delete}
                        onClick={confirmDeleteHandler}
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