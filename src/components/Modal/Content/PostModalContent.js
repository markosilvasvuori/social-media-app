import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { auth, firestoreDB } from "../../../firebase/firebase";
import { doc, onSnapshot } from 'firebase/firestore';

import { ModalContext } from "../../../store/modal-context";
import { MenuModalContext } from "../../../store/menu-modal-context";
import { PostContext } from "../../../store/post-context";
import { UserContext } from "../../../store/user-context";
import CloseButton from "../../UI/CloseButton";
import MenuButton from "../../UI/MenuButton";
import ProfilePicture from "../../UI/ProfilePicture";
import Button from '../../UI/Button';
import MenuForOwnPosts from "../MenuModal/Content/MenuForOwnPosts";
import MenuForPosts from "../MenuModal/Content/MenuForPosts";
import Comment from "../../Post/Comment";
import UsersModalContent from "./UsersModalContent";
import likeIcon from '../../../images/like.svg';
import likedIcon from '../../../images/liked.svg';
import classes from './PostModalContent.module.css';

const PostModalContent = ({ userId, postId, imageUrl, username, likes, caption, comments, editing = false }) => {
    const [isEditing, setIsEditing] = useState(editing);
    const [liked, setLiked] = useState(false);
    const [likesLength, setLikesLength] = useState(likes.length)
    const [enteredCaption, setEnteredCaption] = useState(caption);
    const [enteredComment, setEnteredComment] = useState('');
    const [postComments, setPostComments] = useState(comments);
    const { modalCtx } = useContext(ModalContext);
    const { menuModalCtx } = useContext(MenuModalContext);
    const { postCtx } = useContext(PostContext);
    const { userCtx } = useContext(UserContext);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const postsSnapshot = onSnapshot(doc(firestoreDB, 'users', userId), (doc) => {
            const posts = doc.data().posts;
            
            posts.map((post) => {
                if (post.postId === postId) {
                    const reversedComments = [...post.comments].reverse();
                    setPostComments(reversedComments);
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
        likes.map((like) => {
            if (like === currentUser.uid) {
                setLiked(true);
            };
        })
    }, []);

    const captionOnChangeHandler = (event) => {
        setEnteredCaption(event.target.value);
    };
    
    const closeModalHandler = () => {
        modalCtx.modalHandler();
    };

    const showMenuHandler = () => {
        menuModalCtx.menuHandler(
            userId === currentUser.uid ?
            <MenuForOwnPosts postId={postId} editPost={editPostHandler} /> :
            <MenuForPosts userId={userId} />
        );
    };

    const editPostHandler = () => {
        setIsEditing(!isEditing);
    };

    const saveChangesHandler = () => {
        postCtx.saveChanges(postId, enteredCaption);
        closeModalHandler();
    };

    const enteredCommentHandler = (event) => {
        setEnteredComment(event.target.value);
    };

    const addCommentHandler = (event) => {
        event.preventDefault();
        if (enteredComment) {
            postCtx.addComment(postId, currentUser.uid, userId, userCtx.user.username, enteredComment);
            setEnteredComment('');
        };
    };

    const addLikeHandler = () => {
        postCtx.addLike(userId, postId, currentUser.uid);
        setLiked(true);
    };

    const removeLikeHandler = () => {
        postCtx.removeLike(userId, postId, currentUser.uid);
        setLiked(false);
    };

    const showLikesHandler = () => {
        modalCtx.modalHandler(
            <UsersModalContent 
                users={likes} 
                username={username} 
                category={'Likes'} 
            />,
            false
        )
    };

    return (
        <div className={classes.post}>
            <div className={classes.image}>
                <img src={imageUrl} alt='post' />
            </div>
            <div className={classes.container}>
                <header className={classes.header}>
                    <div className={classes.close}>
                        <CloseButton onClick={closeModalHandler} />
                    </div>
                    {!isEditing &&
                        <div className={classes.user}>
                            <Link to={`profile/${userId}`}>
                                <ProfilePicture 
                                    userId={userId}
                                    size='small'
                                />
                            </Link>
                            <Link 
                                to={`profile/${userId}`} 
                                onClick={closeModalHandler}
                            >
                                <span className={classes.bold}>{username}</span>
                            </Link>
                        </div>
                    }
                    {isEditing &&
                        <div>
                            <Button 
                                outline={true}
                                onClick={editPostHandler}
                            >
                                Cancel
                            </Button>
                        </div>
                    }
                    <div className={classes.menu}>
                        {!isEditing &&
                            <MenuButton onClick={showMenuHandler} />
                        }
                        {isEditing &&
                            <Button onClick={saveChangesHandler}>Save</Button>
                        }
                    </div>
                </header>
                <div className={classes.comments}>
                    <ul>
                        <li className={classes.caption}>
                            <div className={classes.user}>
                                <Link to={`profile/${userId}`}>
                                    <ProfilePicture 
                                        userId={userId}
                                        size='small'
                                    />
                                </Link>
                            </div>
                            <p>
                                <Link 
                                    className={classes.username}
                                    to={`profile/${userId}`}
                                    onClick={closeModalHandler}
                                >
                                    <span>{username}</span>
                                </Link>
                                {!isEditing &&
                                    caption
                                }
                                {isEditing &&
                                    <input 
                                        type='text' 
                                        value={enteredCaption} 
                                        onChange={captionOnChangeHandler} 
                                    />
                                }
                            </p>
                        </li>
                        {postComments?.map((comment) => (
                            <Comment 
                                key={comment.commentId}
                                postId={postId}
                                postOwnerId={userId}
                                userId={comment.userId}
                                commentId={comment.commentId}
                                username={comment.username}
                                comment={comment.comment}
                                closeModal={closeModalHandler}
                            />
                        ))}
                    </ul>
                </div>
                <div className={classes.bottom}>
                    <div className={classes.actions}>
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
                        <div 
                            className={classes.likes}
                            onClick={showLikesHandler}
                        >
                            {likesLength} Likes
                        </div>
                    </div>
                    <form>
                        <input 
                            className={classes['comment-input']}
                            type='text' 
                            name='comment' 
                            value={enteredComment}
                            placeholder='Add comment...' 
                            onChange={enteredCommentHandler}
                        />
                        <button 
                            className={classes['comment-button']}
                            onClick={addCommentHandler}
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostModalContent;