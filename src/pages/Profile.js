import { useContext } from 'react';

import { UserContext } from '../store/user-context';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfileFeed from '../components/Profile/ProfileFeed';

const Home = () => {
    const {userCtx} = useContext(UserContext);

    return (
        <div className='page-wrapper'>
            <ProfileDetails />
            <ProfileFeed />
        </div>
    );
};

export default Home;