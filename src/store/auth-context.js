import { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestoreDB } from '../firebase/firebase';

export const AuthContext = createContext({
    isLoggedIn: false,
    isLoading: false,
    error: '',
    login: () => {},
    logout: () => {},
    signUp: () => {},
});

export const AuthProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    auth.onAuthStateChanged((user) => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });

    // Login
    const loginHandler = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
                setError('Invalid email or password');
                setIsLoading(false);
            });
    };

    // Logout
    const logoutHandler = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            window.location.href = '/';
        }).catch((error) => {
            console.log(error.code);
        })
    };

    // Sign up new user
    const signUpHandler = (newUserData) => {
        createUserWithEmailAndPassword(auth, newUserData.email, newUserData.password)
        .then((userCredentials) => {
            const user = userCredentials.user;
            setDoc(doc(firestoreDB, 'users', user.uid), {
                userId: user.uid,
                name: newUserData.name,
                username: newUserData.username,
                email: newUserData.email,
                bio: '',
                website: '',
                followers: [],
                following: [],
                posts: [],
                likedPosts: [],
                profilePicture: null,
            });

            setIsLoggedIn(true);
        })
        .catch((error) => {
            console.log(error.message);
            if (error.code === 'auth/email-already-in-use') {
                alert('Email already in use!');
            }
        });
    };

    const authCtx = {
        isLoggedIn: isLoggedIn,
        isLoading: isLoading,
        error: error,
        login: loginHandler,
        logout: logoutHandler,
        signUp: signUpHandler,
    };

    return (
        <AuthContext.Provider value={{authCtx}}>
            {props.children}
        </AuthContext.Provider>
    );
};