import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../store/user-context';
import classes from './MainNav.module.css';

const MainNav = () => {
    const [userId, setUserId] = useState('');
    const {userCtx} = useContext(UserContext);

    useEffect(() => {
        if (userCtx.user) {
            setUserId(userCtx.user.userId);
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
                    <Link to={`profile/${userId}`}>Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;