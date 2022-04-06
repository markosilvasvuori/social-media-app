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
                        <p>Don't have account? <span onClick={changeFormHandler}>Register</span></p>
                    }
                    {createAccount &&
                        <p>Already have an account? <span onClick={changeFormHandler}>Login</span></p>
                    }
                </div>
            </div>
        </div>
    );
};

export default RegisterAndLogin;