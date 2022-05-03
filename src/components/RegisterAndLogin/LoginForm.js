import { Fragment, useState, useContext } from 'react';

import { AuthContext } from '../../store/auth-context';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './Form.module.css';

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const {authCtx} = useContext(AuthContext);

    const enteredEmailHandler = (event) => {
        setEnteredEmail(event.target.value);
    };

    const enteredPasswordHandler = (event) => {
        setEnteredPassword(event.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        setError([]);

        if (enteredEmail.trim() === '') {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Enter email'
            ]));
        };

        if (enteredPassword.trim() === '') {
            isValid = false;
            setError(prevErrors => ([
                ...prevErrors,
                'Enter password'
            ]));
        };

        return isValid;
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        if (validateForm()) {
            authCtx.login(enteredEmail, enteredPassword);
            setIsLoading(false);
        }
        
    };
    
    return (
        <Fragment>
            <form className={classes.form} onSubmit={submitHandler}>
                <input
                    type='text' 
                    placeholder='Username or Email' 
                    onChange={enteredEmailHandler} 
                />
                <input 
                    type='password' 
                    placeholder='Password' 
                    onChange={enteredPasswordHandler} 
                />
                {!authCtx.isLoading &&
                    <Button>Login</Button>
                }
                {authCtx.isLoading &&
                    <LoadingSpinner />
                }
                {error && 
                    <ul className={classes.error}>
                        {error.map((err, index) => 
                            <li key={index}>{err}</li>
                        )}
                    </ul>
                }
                {authCtx.error &&
                    <p className={classes.error}>{authCtx.error}</p>
                }
            </form>
            {/* <p className={classes.p}>Or</p>
            <Button className={classes['guest-button']}>Guest Login</Button> */}
        </Fragment>
    );
};

export default LoginForm;