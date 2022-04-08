import { useContext } from 'react';

import { UserContext } from '../store/user-context';
import ProfileDetails from '../components/Profile/ProfileDetails';

const Home = () => {
    const {userCtx} = useContext(UserContext);

    return (
        <div className='page-wrapper'>
            <ProfileDetails />
        </div>
    );
};

export default Home;