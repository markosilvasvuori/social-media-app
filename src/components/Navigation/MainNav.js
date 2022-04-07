import { useContext } from 'react';

import { AuthContext } from '../../store/auth-context';
import classes from './MainNav.module.css';

const MainNav = () => {
    const {ctxValue} = useContext(AuthContext);
    // const username = ctxValue.user.username;

    return (
        <nav className={classes.nav}>
            <ul>
                <li>
                    <a href='/'>Home</a>
                </li>
                <li>
                    <a href='/'>Add</a>
                </li>
                <li>
                    <a href={`profile/:username`}>Profile</a>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;