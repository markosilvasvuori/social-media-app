import classes from './Header.module.css';

const Header = () => {
    return (
        <header className={classes.header}>
            <h1>Instagram</h1>
            <nav className={classes.nav}>
                <ul>
                    <li>
                        <a href='/'>Home</a>
                    </li>
                    <li>
                        <a href='/'>Add</a>
                    </li>
                    <li>
                        <a href='/'>Profile</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;