import { useContext, useEffect, useState } from 'react';

import { MenuModalContext } from '../../../../store/menu-modal-context';
import { UserContext } from '../../../../store/user-context';
import classes from './MenuContent.module.css';

const MenuForPosts = ({ userId }) => {
    const [isFollowing, setIsFollowing] = useState(null);
    const { menuModalCtx } = useContext(MenuModalContext);
    const { userCtx } = useContext(UserContext);
    const currentUser = userCtx.user;

    useEffect(() => {
        if (currentUser.following.length) {
            currentUser.following.forEach((user) => {
                if (user === userId) {
                    setIsFollowing(true);
                }
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
                <button 
                    className={classes.button}
                    onClick={unfollowHandler}
                >
                    Unfollow
                </button>
            }
            {!isFollowing && 
                <button 
                    className={classes.button}
                    onClick={followHandler}
                >
                    Follow
                </button>
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

export default MenuForPosts;