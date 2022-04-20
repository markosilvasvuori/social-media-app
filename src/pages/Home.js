import { useContext } from 'react';

import { AuthContext } from '../store/auth-context';
import RegisterAndLogin from '../components/RegisterAndLogin/RegisterAndLogin';
import HomeFeed from '../components/HomeFeed/HomeFeed';
import classes from './Styles/Page.module.css';

const Home = () => {
    const {authCtx} = useContext(AuthContext);

    return (
        <div className={classes.wrapper}>
            {!authCtx.isLoggedIn &&
                <RegisterAndLogin />
            }
            {authCtx.isLoggedIn &&
                <HomeFeed />
            }
        </div>
    );
};

export default Home;