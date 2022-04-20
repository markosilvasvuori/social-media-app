import ProfileSettings from '../components/Profile/Settings/ProfileSettings';
import classes from './Styles/Page.module.css';

const Home = () => {

    return (
        <div className={classes.wrapper}>
            <ProfileSettings />
        </div>
    );
};

export default Home;