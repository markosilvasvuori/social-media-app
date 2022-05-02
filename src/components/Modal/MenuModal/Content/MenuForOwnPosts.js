import { useContext, useState } from 'react';

import { MenuModalContext } from '../../../../store/menu-modal-context';
import { ModalContext } from '../../../../store/modal-context';
import { PostContext } from '../../../../store/post-context';
import Button from '../../../UI/Button';
import classes from './MenuContent.module.css';

const MenuForOwnPosts = ({ editPost, postId }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { menuModalCtx } = useContext(MenuModalContext);
    const { postCtx } = useContext(PostContext);
    const { modalCtx } = useContext(ModalContext);

    const closeMenuHandler = () => {
        menuModalCtx.menuHandler();
    };

    const editPostHandler = () => {
        editPost();
        closeMenuHandler();
    };

    const confirmDeleteHandler = () => {
        setIsDeleting(!isDeleting);
    };

    const deletePostHandler = () => {
        postCtx.deletePost(postId);
        closeMenuHandler();
        
        if (modalCtx.modal) {
            modalCtx.modalHandler();
        };
    };

    return (
        <div className={classes.menu}>
            <button 
                className={classes.button}
                onClick={editPostHandler}
            >
                    Edit
                </button>
            {!isDeleting &&
                <button 
                    className={classes.button}
                    onClick={confirmDeleteHandler}
                >
                    Delete
                </button>
            }
            {isDeleting &&
                <div className={classes['confirm-delete']}>
                    <p>Delete this post?</p>
                    <div className={classes.buttons}>
                        <Button 
                            outline={true}
                            onClick={deletePostHandler}
                        >
                            Delete
                        </Button>
                        <Button 
                            outline={true}
                            onClick={confirmDeleteHandler}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            }
            <button 
                className={classes.button}
                onClick={closeMenuHandler}
            >
                Cancel
            </button>
        </div>
    );
};

export default MenuForOwnPosts;