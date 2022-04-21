import { useState, useContext } from 'react';

import { AuthContext } from '../../store/auth-context';

import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './Form.module.css';

const RegisterForm = () => {
    const {authCtx} = useContext(AuthContext);
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
                    'Passwords do not match'
                ]));
            }
        };

        if (!enteredEmail.includes('@' && '.')) {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Enter a valid email address'
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

        if (enteredConfirmPassword.trim() === '' && enteredPassword.trim().length >= 6) {
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
            const newUserData = {
                email: enteredEmail,
                password: enteredPassword,
                name: enteredName,
                username: enteredUsername,
            };

            authCtx.signUp(newUserData);
        };
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
            {!authCtx.isLoading &&
                <Button>Register</Button>
            }
            {authCtx.isLoading &&
                    <LoadingSpinner />
                }
            {error && 
                <ul className={classes.error}>
                    {error.map(err => <li>{err}</li>)}
                </ul>
            }
        </form>
    );
};

export default RegisterForm;