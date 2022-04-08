import { Fragment, useState, useContext } from 'react';

import { UserContext } from '../../store/user-context';
import Button from '../UI/Button';
import classes from './ProfileDetails.module.css';

const ProfileDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const {userCtx} = useContext(UserContext);
    const user = userCtx.user;

    const openSettingsHandler = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Fragment>
            {!isEditing &&
                <header className={classes['user-header']}>
                    <div className={classes['picture-container']}>
                        <button>
                            <img className={classes.picture} src='' alt='' />
                        </button>
                    </div>
                    <div className={classes.details}>
                        <div className={classes.top}>
                            <h2>{user.username}</h2>
                            <Button onClick={openSettingsHandler}>Edit</Button>
                        </div>
                        <div className={classes.middle}>
                            <ul>
                                <li>
                                    <span>10</span>
                                    <span>Posts</span>
                                </li>
                                <li>
                                    <span>42</span>
                                    <span>Followers</span>
                                </li>
                                <li>
                                    <span>25</span>
                                    <span>Following</span>
                                </li>
                            </ul>
                        </div>
                        <div className={classes.bottom}>
                            <span className={classes.name}>Name</span>
                            <span>Bio. Tell something about yourself.</span>
                            <span><a href='#'>www.website.com</a></span>
                        </div>
                    </div>
                </header>
            }
            {isEditing &&
                <div>
                    Settings
                </div>
            }
        </Fragment>
    );
};

export default ProfileDetails;