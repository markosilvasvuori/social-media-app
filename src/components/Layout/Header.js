import Logo from '../UI/Logo';
import MainNav from '../Navigation/MainNav';
import classes from './Header.module.css';
import CreatePostForm from '../Post/CreatePostForm';

const Header = () => {
    return (
        <header className={classes.header}>
            <Logo size={'medium'} />
            <MainNav />
            <CreatePostForm />
        </header>
    );
};

export default Header;