import classes from './ProfilePicture.module.css';

const ProfilePicture = ({ pictureUrl, size }) => {
    const styles = `${classes['profile-picture']} 
                    ${size === 'small' ? classes.small :
                    size === 'medium' ? classes.medium :
                    classes.large
                    }
                `;

    return (
        <div className={styles}>
            <img src={pictureUrl} alt='profile' />
        </div>
    );
};

export default ProfilePicture;