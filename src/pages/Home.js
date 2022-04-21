import { auth } from '../firebase/firebase';

import RegisterAndLogin from '../components/RegisterAndLogin/RegisterAndLogin';
import HomeFeed from '../components/HomeFeed/HomeFeed';
import classes from './Styles/Page.module.css';

const Home = () => {
    return (
        <div className={classes.wrapper}>
            {!auth.currentUser &&
                <RegisterAndLogin />
            }
            {auth.currentUser &&
                <HomeFeed />
            }
        </div>
    );
};

export default Home;