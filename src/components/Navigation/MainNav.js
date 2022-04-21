import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase';
import { UserContext } from '../../store/user-context';
import { ModalContext } from '../../store/modal-context';
import CreatePostForm from '../Post/CreatePostForm';
import addIcon from '../../images/addIcon.svg';
import homeIcon from '../../images/homeIcon.svg';
import classes from './MainNav.module.css';
import ProfilePicture from '../UI/ProfilePicture';

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
                    <Link to='/'>
                        <img 
                            className={classes.icon} 
                            src={homeIcon} 
                            alt='home' 
                        />
                    </Link>
                </li>
                <li>
                    <button onClick={addPostHandler}>
                        <img 
                            className={classes.icon} 
                            src={addIcon} 
                            alt='add' 
                        />
                    </button>
                </li>
                <li>
                    <Link to={`profile/${userId}`}>
                        <ProfilePicture
                            userId={userId}
                            size={'small'}
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;