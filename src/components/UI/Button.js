import classes from './Button.module.css';

const Button = (props) => {
    const styles = `${classes.button} ${props.className ? props.className : ''}`;

    const clickHandler = () => {
        if (props.onClick) {
            props.onClick();
        } else {
            return;
        }
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