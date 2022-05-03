import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ref, getDownloadURL } from 'firebase/storage';
import { auth, storage, firestoreDB } from '../../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import ProfilePicture from '../UI/ProfilePicture';

import { ModalContext } from '../../store/modal-context';
import { MenuModalContext } from '../../store/menu-modal-context';
import { PostContext } from '../../store/post-context';
import MenuButton from '../UI/MenuButton';
import PostModalContent from '../Modal/Content/PostModalContent';
import MenuForOwnPosts from '../Modal/MenuModal/Content/MenuForOwnPosts';
import MenuForPosts from '../Modal/MenuModal/Content/MenuForPosts';
import likeIcon from '../../images/like.svg';
import likedIcon from '../../images/liked.svg';
import commentIcon from '../../images/comment.svg';
import UsersModalContent from '../Modal/Content/UsersModalContent';
import PostPlaceholder from './PostPlaceholder';
import classes from './Post.module.css';

const Post = ({ userId, postId, username, likes, caption, comments, inModal = false }) => {
    const [commentsLength, setCommentsLength] = useState(comments.length);
    const [likesLength, setLikesLength] = useState(likes.length);
    const [imageUrl, setImageUrl] = useState(null);
    const [liked, setLiked] = useState(false);
    const { modalCtx } = useContext(ModalContext);
    const { menuModalCtx } = useContext(MenuModalContext);
    const { postCtx } = useContext(PostContext);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const postsSnapshot = onSnapshot(doc(firestoreDB, 'users', userId), (doc) => {
            const posts = doc.data().posts;

            posts.map((post) => {
                if (post.postId === postId) {
                    setCommentsLength(post.comments.length);
                    setLikesLength(post.likes.length);
                    
                    if (post.likes.includes(currentUser.uid)) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }
                }
            });
        });
    }, []);

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

    useEffect(() => {
        likes.map((like) => {
            if (like === currentUser.uid) {
                setLiked(true);
            };
        })
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

    const addLikeHandler = () => {
        postCtx.addLike(userId, postId, currentUser.uid);
        setLiked(true);
    };

    const removeLikeHandler = () => {
        postCtx.removeLike(userId, postId, currentUser.uid);
        setLiked(false);
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

    const showLikesHandler = async () => {
        const postLikes = await postCtx.getRealtimeLikes(userId, postId);
        modalCtx.modalHandler(
            <UsersModalContent 
                users={postLikes} 
                username={username} 
                category={'Likes'} 
            />,
            inModal ? false : true
        );
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
                {imageUrl &&
                    <img src={imageUrl} alt='post' />
                }
                {!imageUrl &&
                    <PostPlaceholder />
                }
            </div>
            <div className={classes.bottom}>
                <section className={classes.buttons}>
                    {!liked &&
                        <button 
                            className={classes.icon}
                            onClick={addLikeHandler}
                        >
                            <img src={likeIcon} alt='like' />
                        </button>
                    }
                    {liked &&
                        <button 
                            className={classes.icon}
                            onClick={removeLikeHandler}
                        >
                            <img src={likedIcon} alt='liked' />
                        </button>
                    }
                    <button 
                        className={classes.icon}
                        onClick={openInModalHandler}
                    >
                        <img src={commentIcon} alt='comment' />
                    </button>
                </section>
                <section>
                    <div 
                        className={classes.likes}
                        onClick={showLikesHandler}
                    >
                        {likesLength} likes
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
                    Show all {commentsLength} comments
                </button>
            </div>
        </div>
    );
};

export default Post;