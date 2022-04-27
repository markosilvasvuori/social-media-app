import { Fragment, useContext } from 'react';

import { UserContext } from '../../store/user-context';
import classes from './PostEditMenu.module.css';

const PostEditMenu = ({ userId }) => {
    const { userCtx } = useContext(UserContext);
    const currentUser = userCtx.user;

    return (
        <div className={classes.menu}>
            {userId === currentUser.userId &&
                <Fragment>
                    <button>Edit</button>
                    <button>Delete</button>
                </Fragment>
            }
            {userId !== currentUser.userId &&
                <button>Unfollow</button>
            }
        </div>
    );
};

export default PostEditMenu;