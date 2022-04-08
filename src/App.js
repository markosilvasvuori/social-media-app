import { Fragment, useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContext } from './store/auth-context';
import { UserContext } from './store/user-context';
import Header from './components/Layout/Header';
import './App.css';

import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const {authCtx} = useContext(AuthContext);
  const {userCtx} = useContext(UserContext);

  // If logged in, get user data
  useEffect(() => {
    if (authCtx.isLoggedIn) {
      userCtx.getUserData();
    };
  }, [authCtx.isLoggedIn]);

  return (
    <Fragment>
      {authCtx.isLoggedIn &&
        <Header />
      }
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='profile/:username' element={<Profile />} />
      </Routes>
    </Fragment>
  );
}

export default App;
