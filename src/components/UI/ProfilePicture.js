import { useState, useEffect, useContext } from 'react';

import { ref, getDownloadURL, } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

import { UserContext } from '../../store/user-context';
import { ModalContext } from '../../store/modal-context';
import profilePicture from '../../images/profile.png';
import classes from './ProfilePicture.module.css';

const ProfilePicture = ({ size, userId, className }) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState(profilePicture);
    const { userCtx } = useContext(UserContext);
    const { modalCtx } = useContext(ModalContext);

    const styles = `${classes['profile-picture']} 
                    ${className ? className : ''}
                    ${size === 'small' ? classes.small :
                    size === 'medium' ? classes.medium :
                    classes.large
                    }
                `;

    useEffect(() => {
        const fetchProfilePicture = async () => {
            await getDownloadURL(ref(storage, `users/profilePictures/${userId}`))
                .then((url) => {
                    setProfilePictureUrl(url);
                })
                .catch((error) => {
                    setProfilePictureUrl(profilePicture);
                });
        };

        if (userId) {
            fetchProfilePicture();
        };
    }, [userId, userCtx.updateProfilePicture]);

    return (
        <div 
            className={styles} 
            onClick={modalCtx.modal ? modalCtx.modalHandler : () => {}}
        >
            <img 
                src={profilePictureUrl} 
                alt='profile' 
            />
        </div>
    );
};

export default ProfilePicture;