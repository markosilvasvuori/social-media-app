import classes from './Logo.module.css';

const Logo = ({ size }) => {
    const styles = `${
                        size === 'small' ? classes.small :
                        size === 'medium' ? classes.medium :
                        classes.large
                    }`;

    return (
        <div className={`${classes.logo} ${styles}`}>Some App</div>
    );
};

export default Logo;