import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase';
import { ModalContext } from '../../store/modal-context';
import CreatePostForm from '../Post/CreatePostForm';
import addIcon from '../../images/addIcon.svg';
import homeIcon from '../../images/homeIcon.svg';
import classes from './MainNav.module.css';
import ProfilePicture from '../UI/ProfilePicture';

const MainNav = () => {
    const { modalCtx } = useContext(ModalContext);
    const currentUserId = auth.currentUser.uid;

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
                    <Link to={`profile/${currentUserId}`}>
                        <ProfilePicture
                            userId={currentUserId}
                            size={'small'}
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;