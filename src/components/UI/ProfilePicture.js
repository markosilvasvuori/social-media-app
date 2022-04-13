import { Link } from 'react-router-dom';

import classes from './ProfilePicture.module.css';

const ProfilePicture = ({ pictureUrl, size, userId }) => {
    const styles = `${classes['profile-picture']} 
                    ${size === 'small' ? classes.small :
                    size === 'medium' ? classes.medium :
                    classes.large
                    }
                `;

    return (
        <Link to={`profile/${userId}`}>
            <div className={styles}>
                <img src={pictureUrl} alt='profile' />
            </div>
        </Link>
    );
};

export default ProfilePicture;