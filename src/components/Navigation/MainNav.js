import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../store/user-context';
import classes from './MainNav.module.css';

const MainNav = () => {
    const {userCtx} = useContext(UserContext);
    // const username = userCtx.user.username;

    return (
        <nav className={classes.nav}>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/'>Add</Link>
                </li>
                <li>
                    <Link to={`profile/:${userCtx.user.username}`}>Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;