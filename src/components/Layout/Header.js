import Logo from '../UI/Logo';
import MainNav from '../Navigation/MainNav';
import classes from './Header.module.css';

const Header = () => {

    return (
        <header className={classes.header}>
            <Logo size={'medium'} />
            <MainNav />
        </header>
    );
};

export default Header;