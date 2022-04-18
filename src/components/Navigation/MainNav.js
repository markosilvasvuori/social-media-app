import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../store/user-context';
import { ModalContext } from '../../store/modal-context';
import CreatePostForm from '../Post/CreatePostForm';
import classes from './MainNav.module.css';

const MainNav = () => {
    const [userId, setUserId] = useState('');
    const { userCtx } = useContext(UserContext);
    const { modalCtx } = useContext(ModalContext);

    useEffect(() => {
        if (userCtx.user) {
            setUserId(userCtx.user.userId);
        }
    }, [userCtx.user]);

    const addPostHandler = () => {
        modalCtx.modalHandler(<CreatePostForm />)
    };

    return (
        <nav className={classes.nav}>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <button onClick={addPostHandler}>Add</button>
                </li>
                <li>
                    <Link to={`profile/${userId}`}>Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;