import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { auth } from "../../../firebase/firebase";

import { ModalContext } from "../../../store/modal-context";
import { MenuModalContext } from "../../../store/menu-modal-context";
import { PostContext } from "../../../store/post-context";
import CloseButton from "../../UI/CloseButton";
import MenuButton from "../../UI/MenuButton";
import ProfilePicture from "../../UI/ProfilePicture";
import Button from '../../UI/Button';
import MenuForOwnPosts from "../MenuModal/Content/MenuForOwnPosts";
import classes from './PostModalContent.module.css';
import MenuForPosts from "../MenuModal/Content/MenuForPosts";

const PostModalContent = ({ userId, postId, imageUrl, username, likes, caption, comments, editing = false }) => {
    const [isEditing, setIsEditing] = useState(editing);
    const [enteredCaption, setEnteredCaption] = useState(caption);
    const { modalCtx } = useContext(ModalContext);
    const { menuModalCtx } = useContext(MenuModalContext);
    const { postCtx } = useContext(PostContext);
    const currentUser = auth.currentUser;

    const captionOnChangeHandler = (event) => {
        setEnteredCaption(event.target.value);
    };
    
    const closeModalHandler = () => {
        modalCtx.modalHandler();
    };

    const showMenuHandler = () => {
        menuModalCtx.menuHandler(
            userId === currentUser.uid ?
            <MenuForOwnPosts editPost={editPostHandler} /> :
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
                        <li className={classes.comment}>
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
                        {/* {comments.map((comment) => {
                            <li>
                                <div className={classes['comment-user']}>
                                    <ProfilePicture 
                                        userId={comment.userId}
                                        size='small'
                                    />
                                    <Link to={`profile/${comment.userId}`}>
                                        <p className={classes.bold}>{comment.username}</p>
                                    </Link>
                                </div>
                                <p>{comment.text}</p>
                            </li>
                        })} */}
                    </ul>
                </div>
                <div className={classes.bottom}>
                    <div className={classes.actions}>
                        <button>Like</button>
                        <div className={classes.likes}>{likes.length} Likes</div>
                    </div>
                    <form>
                        <input 
                            className={classes['comment-input']}
                            type='text' 
                            name='comment' 
                            placeholder='Add comment...' 
                        />
                        <button className={classes['comment-button']}>Add</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostModalContent;