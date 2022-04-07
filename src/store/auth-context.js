import { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestoreDB } from '../firebase/firebase';

export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    signUp: () => {},
    user: null,
    error: '',
});

export const AuthProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Login
    const loginHandler = (email, password) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setIsLoggedIn(true);
                setUser(user);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
                setError('Invalid email or password');
            });
    };

    // Logout
    const logoutHandler = () => {

    };

    // Sign up new user
    const signUpHandler = (newUserData) => {
        createUserWithEmailAndPassword(auth, newUserData.email, newUserData.password)
        .then((userCredentials) => {
            const user = userCredentials.user;
            setUser(user);
            return setDoc(doc(firestoreDB, 'users', user.uid), {
                name: newUserData.name,
                username: newUserData.username,
                email: newUserData.email,
                bio: '',
                website: '',
                followers: 0,
                following: 0,
                posts: [],
                likedPosts: [],
            });
        })
        .catch((error) => {
            console.log(error.message);
        });

        setIsLoggedIn(true);
    };

    const ctxValue = {
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        signUp: signUpHandler,
        user: user,
        isLoading: isLoading,
        error: error,
    };

    return (
        <AuthContext.Provider value={{ctxValue}}>
            {props.children}
        </AuthContext.Provider>
    );
};