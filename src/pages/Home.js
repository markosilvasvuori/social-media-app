import { Fragment, useContext } from 'react';

import { AuthContext } from '../store/auth-context';
import RegisterAndLogin from '../components/RegisterAndLogin/RegisterAndLogin';
import HomeFeed from '../components/HomeFeed/HomeFeed';

const Home = () => {
    const {authCtx} = useContext(AuthContext);

    return (
        <div className='page-wrapper'>
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