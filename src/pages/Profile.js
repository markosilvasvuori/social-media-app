import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfileFeed from '../components/Profile/ProfileFeed';
import classes from './Styles/Page.module.css';

const Home = () => {
    return (
        <div className={classes.wrapper}>
            <ProfileDetails />
            <ProfileFeed />
        </div>
    );
};

export default Home;