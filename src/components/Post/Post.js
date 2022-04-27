import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ref, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../firebase/firebase';
import ProfilePicture from '../UI/ProfilePicture';

import { ModalContext } from '../../store/modal-context';
import { MenuModalContext } from '../../store/menu-modal-context';
import MenuButton from '../UI/MenuButton';
import PostModalContent from '../Modal/Content/PostModalContent';
import classes from './Post.module.css';
import MenuForOwnPosts from '../Modal/MenuModal/Content/MenuForOwnPosts';
import MenuForPosts from '../Modal/MenuModal/Content/MenuForPosts';

const Post = ({ userId, postId, username, likes, caption, comments, inModal = false }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const { modalCtx } = useContext(ModalContext);
    const { menuModalCtx } = useContext(MenuModalContext);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchImage = async () => {
            await getDownloadURL(ref(storage, `posts/${postId}`))
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

    const openInModalHandler = () => {
        modalCtx.modalHandler(
            <PostModalContent 
                userId={userId}
                postId={postId}
                imageUrl={imageUrl}
                username={username}
                likes={likes}
                caption={caption}
                comments={comments}
            />,
            inModal ? false : true
        );
    };

    const editPostHandler = () => {
        modalCtx.modalHandler(
            <PostModalContent 
                userId={userId}
                postId={postId}
                imageUrl={imageUrl}
                username={username}
                likes={likes}
                caption={caption}
                editing={true} 
            />,
            inModal ? false : true
        );
    };

    const showMenuHandler = () => {
        menuModalCtx.menuHandler(
            userId === currentUser.uid ?
            <MenuForOwnPosts postId={postId} editPost={editPostHandler} /> :
            <MenuForPosts userId={userId} />
        );
    };

    const closeModalHandler = () => {
        if (modalCtx.modal) {
            modalCtx.modalHandler();
        }
    };

    return (
        <div className={`${classes.post} ${inModal ? classes['in-modal'] : ''}`}>
            <header className={classes.header}>
                <div className={classes.user} onClick={closeModalHandler}>
                    <ProfilePicture 
                        size={'small'} 
                        userId={userId}
                    />
                    <Link to={`profile/${userId}`}>
                        <p className={classes.bold}>{username}</p>
                    </Link>
                </div>
                <MenuButton onClick={showMenuHandler} />
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
                    <div className={classes.likes}>
                        {likes.length} likes
                    </div>
                </section>
                <section>
                    <span>
                        <Link 
                            className={classes.bold} 
                            to={`profile/${userId}`}
                            onClick={closeModalHandler}
                        >
                            {username}
                        </Link>
                        <span className={classes.caption}>{caption}</span>
                    </span>
                </section>
                <button
                    className={classes.comments} 
                    onClick={openInModalHandler}
                >
                    Show all {comments.length} comments
                </button>
            </div>
        </div>
    );
};

export default Post;