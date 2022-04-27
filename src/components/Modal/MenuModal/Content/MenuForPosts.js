import { useContext, useEffect, useState } from 'react';

import { MenuModalContext } from '../../../../store/menu-modal-context';
import { UserContext } from '../../../../store/user-context';
import classes from './MenuContent.module.css';

const MenuForPosts = ({ userId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const { menuModalCtx } = useContext(MenuModalContext);
    const { userCtx } = useContext(UserContext);
    const currentUser = userCtx.user;

    useEffect(() => {
        if (currentUser.following.length) {
            currentUser.following.map((user) => {
                user === userId ? setIsFollowing(true) : setIsFollowing(false)
            });
        }
    }, []);

    const closeMenuHandler = () => {
        menuModalCtx.menuHandler();
    };

    const followHandler = () => {
        userCtx.follow(userId);
        setIsFollowing(true);
    };

    const unfollowHandler = () => {
        userCtx.unfollow(userId);
        setIsFollowing(false);
    };

    return (
        <div className={classes.menu}>
            {isFollowing && 
                <button onClick={unfollowHandler}>Unfollow</button>
            }
            {!isFollowing && 
                <button onClick={followHandler}>Follow</button>
            }
            <button onClick={closeMenuHandler}>Cancel</button>
        </div>
    );
};

export default MenuForPosts;