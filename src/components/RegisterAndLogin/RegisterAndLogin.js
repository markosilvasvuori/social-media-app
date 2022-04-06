import { useState } from 'react';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import classes from './RegisterAndLogin.module.css';
import Logo from '../UI/Logo';

const RegisterAndLogin = () => {
    const [createAccount, setCreateAccount] = useState(false);

    const changeFormHandler = () => {
        setCreateAccount(!createAccount);
    };

    return (
        <div className={classes.container}>
            <div className={classes['column-left']}>
                <img src='https://images.pexels.com/photos/2066896/pexels-photo-2066896.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' alt='' />
            </div>
            <div className={classes['column-right']}>
                <div className={classes.forms}>
                    <Logo size={'large'} />
                    {!createAccount &&
                        <LoginForm />
                    }
                    {createAccount &&
                        <RegisterForm />
                    }
                </div>
                <div className={classes.register}>
                    {!createAccount && 
                        <p>Don't have an account? <span className={classes.clickable} onClick={changeFormHandler}>Register</span></p>
                    }
                    {createAccount &&
                        <p>Have an account? <span className={classes.clickable} onClick={changeFormHandler}>Log in</span></p>
                    }
                </div>
            </div>
        </div>
    );
};

export default RegisterAndLogin;