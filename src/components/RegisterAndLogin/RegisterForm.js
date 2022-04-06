import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestoreDB } from '../../firebase/firebase';

import Button from '../UI/Button';
import classes from './Form.module.css';

const RegisterForm = () => {
    const [error, setError] = useState([]);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredName, setEnteredName] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassowrd] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassowrd] = useState('');

    const enteredEmailHandler = (event) => {
        setEnteredEmail(event.target.value);
    };

    const enteredNameHandler = (event) => {
        setEnteredName(event.target.value);
    };

    const enteredUsernameHandler = (event) => {
        setEnteredUsername(event.target.value);
    };

    const enteredPasswordHandler = (event) => {
        setEnteredPassowrd(event.target.value);
    };

    const enteredConfirmPasswordHandler = (event) => {
        setEnteredConfirmPassowrd(event.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        setError([]);

        if (enteredPassword !== '' && enteredConfirmPassword !== '') {
            if (enteredPassword !== enteredConfirmPassword) {
                isValid = false;
                setError(prevErrors => ([
                    ...prevErrors,
                    'Passwords does not match'
                ]));
            }
        };

        if (!enteredEmail.includes('@' && '.')) {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Enter valid email'
            ]));
        };

        if (enteredName.trim() === '') {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Enter name'
            ]));
        };

        if (enteredUsername.trim() === '') {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Enter username'
            ]));
        };

        if (enteredPassword.trim().length < 6) {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Password must be at least 6 characters long'
            ]));
        };

        if (enteredConfirmPassword.trim() === '') {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Confirm password'
            ]));
        };

        return isValid;
    }

    const submitHandler = (event) => {
        event.preventDefault();

        // Sign up new user
        if (validateForm()) {
            createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
                .catch((userCredentials) => {
                    const user = userCredentials.user;
                    return setDoc(doc(firestoreDB, 'users', user.uid), {
                        name: enteredName,
                        username: enteredUsername,
                        email: enteredEmail,
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
        }
    };
    
    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <input 
                type='text' 
                placeholder='Email' 
                onChange={enteredEmailHandler} 
            />
            <input 
                type='text' 
                placeholder='Name' 
                onChange={enteredNameHandler} 
            />
            <input 
                type='text' 
                placeholder='Username' 
                onChange={enteredUsernameHandler} 
            />
            <input 
                type='password' 
                placeholder='Password' 
                onChange={enteredPasswordHandler} 
            />
            <input 
                type='password' 
                placeholder='Confirm Password' 
                onChange={enteredConfirmPasswordHandler} 
            />
            {error && 
                error.map(err => <p>{err}</p>)
            }
            <Button>Register</Button>
        </form>
    );
};

export default RegisterForm;