import classes from './MenuButton.module.css';

const MenuButton = (props) => {
    const clickHandler = () => {
        if (props.onClick) {
            props.onClick();
        }
    }

    return (
        <button 
            className={classes.button} 
            onClick={clickHandler}
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
};

export default MenuButton;