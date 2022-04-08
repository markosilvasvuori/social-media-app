import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../store/user-context';
import classes from './MainNav.module.css';

const MainNav = () => {
    const [username, setUsername] = useState('');
    const {userCtx} = useContext(UserContext);

    useEffect(() => {
        if (userCtx.user) {
            setUsername(userCtx.user.username);
        }
    }, [userCtx.user]);

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
                    <Link to={`profile/${username}`}>Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;