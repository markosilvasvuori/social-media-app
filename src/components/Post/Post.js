import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import ProfilePicture from '../UI/ProfilePicture';

import classes from './Post.module.css';

const Post = ({ userId, imageId, username, likes, caption, comments }) => {
    const [imageUrl, setImageUrl] = useState(null);

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

    return (
        <div className={classes.post}>
            <header className={classes.header}>
                <div className={classes.user}>
                    <ProfilePicture 
                        size={'small'} 
                        userId={userId}
                    />
                    <Link to={`profile/${userId}`}>
                        <p className={classes.bold}>{username}</p>
                    </Link>
                </div>
                <button className={classes['menu-button']}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
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
                        <Link 
                            className={classes.bold} 
                            to={`profile/${userId}`}
                        >
                            {username}
                        </Link>
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