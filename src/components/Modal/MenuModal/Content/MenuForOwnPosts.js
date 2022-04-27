import { useContext } from 'react';

import { MenuModalContext } from '../../../../store/menu-modal-context';
import { PostContext } from '../../../../store/post-context';
import classes from './MenuContent.module.css';

const MenuForOwnPosts = ({ editPost, postId }) => {
    const { menuModalCtx } = useContext(MenuModalContext);
    const { postCtx } = useContext(PostContext);

    const closeMenuHandler = () => {
        menuModalCtx.menuHandler();
    };

    const editPostHandler = () => {
        editPost();
        closeMenuHandler();
    };

    const deletePostHandler = () => {
        postCtx.deletePost(postId);
        closeMenuHandler();
    };

    return (
        <div className={classes.menu}>
            <button onClick={editPostHandler}>Edit</button>
            <button onClick={deletePostHandler}>Delete</button>
            <button onClick={closeMenuHandler}>Cancel</button>
        </div>
    );
};

export default MenuForOwnPosts;