import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { auth } from "../../firebase/firebase";

import { PostContext } from "../../store/post-context";
import ProfilePicture from "../UI/ProfilePicture";
import classes from './Comment.module.css';

const Comment = ({ postId, postOwnerId, userId, commentId, comment, closeModal }) => {
    const [username, setUsername] = useState('');
    const { postCtx } = useContext(PostContext);
    const currentUserId = auth.currentUser.uid;

    useEffect(() => {
        const getUsername = async () => {
            const commenterUsername = await postCtx.getUsername(userId);
            setUsername(commenterUsername);
        }

        getUsername();
    }, []);

    const deleteCommentHandler = () => {
        postCtx.deleteComment(postOwnerId, postId, commentId);
    };

    return (
        <li className={classes.comment}>
            <div className={classes.user}>
                <ProfilePicture 
                    userId={userId}
                    size='small'
                />
            </div>
            <p>
                <Link 
                    className={classes.username}
                    to={`profile/${userId}`}
                    onClick={closeModal}
                >
                    <span>{username}</span>
                </Link>
                {comment}
            </p>
            {userId === currentUserId &&
                <button 
                    className={classes['delete-button']}
                    onClick={deleteCommentHandler}
                >
                    <span></span>
                    <span></span>
                </button>
            }
        </li>
    );
};

export default Comment;