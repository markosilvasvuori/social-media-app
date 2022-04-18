import { Fragment, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

import { UserContext } from '../../store/user-context';
import { ModalContext } from '../../store/modal-context';
import classes from './ProfilePicture.module.css';

const ProfilePicture = ({ size, userId }) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const { userCtx } = useContext(UserContext);
    const user = userCtx.user;
    const { modalCtx } = useContext(ModalContext);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (!user.profilePicture) {
                await getDownloadURL(ref(storage, 'assets/profile.png'))
                .then((url) => {
                    setProfilePictureUrl(url);
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                });
            } else {
                await getDownloadURL(ref(storage, `users/${userId}/profilePicture/profile`))
                .then((url) => {
                    setProfilePictureUrl(url);
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                });
            };
        };

        fetchProfilePicture();
    }, []);

    const styles = `${classes['profile-picture']} 
                    ${size === 'small' ? classes.small :
                    size === 'medium' ? classes.medium :
                    classes.large
                    }
                `;

    return (
        <Fragment>
            {modalCtx.modal &&
            <Link 
                to={`profile/${userId}`}
                onClick={modalCtx.modal}
            >
                <div className={styles}>
                    <img 
                        src={profilePictureUrl} 
                        alt='profile' 
                    />
                </div>
            </Link>
            }
            {!modalCtx.modal &&
                <div className={styles}>
                    <img 
                        src={profilePictureUrl} 
                        alt='profile' 
                    />
                </div>
            }
        </Fragment>
    );
};

export default ProfilePicture;