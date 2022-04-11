import { useEffect, useState } from 'react';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

import classes from './Post.module.css';

const Post = ({ username, userId, imageId, likes, caption, comments }) => {
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
                    <img src='' alt='' />
                    <p className={classes.bold}>{username}</p>
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