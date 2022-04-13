import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import ProfilePicture from '../UI/ProfilePicture';

import classes from './Post.module.css';

const Post = ({ userId, imageId, username, profilePicture, likes, caption, comments }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            await getDownloadURL(ref(storage, `posts/${userId}/${imageId}`))
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
        };

        fetchImage();
    }, []);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (!profilePicture) {
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

    return (
        <div className={classes.post}>
            <header className={classes.header}>
                <div className={classes.user}>
                    <ProfilePicture 
                        pictureUrl={profilePictureUrl} 
                        size={'small'} 
                        userId={userId}
                    />
                    <Link to={`profile/${userId}`}>
                        <p className={classes.bold}>{username}</p>
                    </Link>
                </div>
                <button>...</button>
            </header>
            <div className={classes.content}>
                <img src={imageUrl} alt='post' />
            </div>
            <div className={classes.bottom}>
                <section className={classes.buttons}>
                    <button>Like</button>
                    <button>Comment</button>
                </section>
                <section>
                    <div className={classes.bold}>
                        {likes} likes
                    </div>
                </section>
                <section>
                    <p>
                        <a className={classes.bold} href='#'>{username} </a>
                        {caption}
                    </p>
                </section>
                <a className={classes.comments} href='#'>
                    Show all {comments.length} comments
                </a>
            </div>
        </div>
    );
};

export default Post;