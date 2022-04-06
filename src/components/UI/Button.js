import classes from './Button.module.css';

const Button = (props) => {
    const styles = `${classes.button} ${props.className ? props.className : ''}`;

    const clickHandler = () => {
        props.onClick();
        console.log('clicked')
    }

    return (
        <button 
            className={styles} 
            onClick={clickHandler}
        >
            {props.children}
        </button>
    );
};

export default Button;