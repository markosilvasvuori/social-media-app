import { Fragment } from 'react';

import Button from '../UI/Button';
import classes from './Form.module.css';

const LoginForm = () => {
    const submitHandler = () => {
        console.log('submitting');
    };
    
    return (
        <Fragment>
            <form className={classes.form} onSubmit={submitHandler}>
                <input type='text' placeholder='Username or Email' />
                <input type='password' placeholder='Password' />
                <Button>Login</Button>
            </form>
            <p className={classes.p}>Or</p>
            <Button className={classes['guest-button']}>Guest Login</Button>
        </Fragment>
    );
};

export default LoginForm;