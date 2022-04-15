import classes from './CloseButton.module.css';

const CloseButton = (props) => {
    const onClickHandler = () => {
        props.onClick();
    };
    
    return (
        <div 
            className={classes['close-button']}
            onClick={onClickHandler}
        >
            <span></span>
            <span></span>
        </div>
    );
};

export default CloseButton;