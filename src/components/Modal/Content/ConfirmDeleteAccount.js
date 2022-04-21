import { useState, useContext, Fragment } from "react";

import { auth, firestoreDB, storage } from "../../../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { ref, deleteObject } from "firebase/storage";

import { AuthContext } from "../../../store/auth-context";
import { UserContext } from "../../../store/user-context";
import { ModalContext } from "../../../store/modal-context";
import Button from "../../UI/Button";
import CloseButton from "../../UI/CloseButton";
import classes from './ConfirmDeleteAccount.module.css';

const ConfirmDeleteAccount = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [error, setError] = useState('');
    const { authCtx } = useContext(AuthContext);
    const { modalCtx } = useContext(ModalContext);
    const { userCtx } = useContext(UserContext);
    const user = userCtx.user;

    const currentPasswordOnChangeHandler = (event) => {
        setCurrentPassword(event.target.value);
    };

    const reAuthenticateUser = async (currentPassword) => {
        setError('');

        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
        ).then(() => {
            deleteAccount();
        }).catch((error) => {
            console.log(error.message);
            if (currentPassword === '') {
                setError('Enter current password to delete account');
            }

            if (currentPassword !== '') {
                setError('Wrong password');
            }
        });
    };

    const deleteAccount = async () => {
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
            authCtx.logout();
        }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
        });
        modalCtx.modalHandler();
    };

    const confirmDeleteHandler = (event) => {
        event.preventDefault();
        reAuthenticateUser(currentPassword);
    };

    return (
        <Fragment>
            <header className={classes.header}>
                <h2>Delete Account</h2>
                <CloseButton onClick={modalCtx.modalHandler} />
            </header>
            <div className={classes.content}>
                <p>Type current password to delete account</p>
                <form
                    className={classes.form} 
                    onSubmit={confirmDeleteHandler}>
                    <input
                        id='password'
                        type='password'
                        name='password'
                        value={currentPassword}
                        placeholder='Current password'
                        onChange={currentPasswordOnChangeHandler}
                    />
                    <Button>Delete Account</Button>
                    {error &&
                        <p>{error}</p>
                    }
                </form>
            </div>
        </Fragment>
    );
};

export default ConfirmDeleteAccount;