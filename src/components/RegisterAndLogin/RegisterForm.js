import Button from '../UI/Button';
import classes from './Form.module.css';

const RegisterForm = () => {
    const submitHandler = () => {
        console.log('submitting');
    };
    
    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <input type='text' placeholder='Email' />
            <input type='text' placeholder='Full Name' />
            <input type='text' placeholder='Username' />
            <input type='password' placeholder='Password' />
            <Button>Register</Button>
        </form>
    );
};

export default RegisterForm;