import { useContext } from 'react';

import { AuthContext } from '../store/auth-context';
import ProfileDetails from '../components/Profile/ProfileDetails';

const Home = () => {
    const {ctxValue} = useContext(AuthContext);

    return (
        <div className='page-wrapper'>
            <ProfileDetails />
        </div>
    );
};

export default Home;