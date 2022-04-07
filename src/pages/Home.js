import { Fragment, useContext } from 'react';

import { AuthContext } from '../store/auth-context';
import RegisterAndLogin from '../components/RegisterAndLogin/RegisterAndLogin';
import HomeFeed from '../components/HomeFeed/HomeFeed';

const Home = () => {
    const {ctxValue} = useContext(AuthContext);

    return (
        <div className='page-wrapper'>
            {!ctxValue.isLoggedIn &&
                <RegisterAndLogin />
            }
            {ctxValue.isLoggedIn &&
                <HomeFeed />
            }
        </div>
    );
};

export default Home;