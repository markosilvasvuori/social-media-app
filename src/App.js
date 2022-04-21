import { Fragment, useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContext } from './store/auth-context';
import { UserContext } from './store/user-context';
import { ModalContext } from './store/modal-context';
import Header from './components/Layout/Header';
import Modal from './components/Modal/Modal';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { auth } from './firebase/firebase';


function App() {
  const {authCtx} = useContext(AuthContext);
  const {userCtx} = useContext(UserContext);
  const {modalCtx} = useContext(ModalContext);

  // If logged in, get user data
  useEffect(() => {
    if (auth.currentUser) {
      userCtx.getUserData();
    };
  }, [auth.currentUser]);

  return (
    <Fragment>
      {authCtx.isLoggedIn &&
        <Header />
      }
      {modalCtx.modal &&
        <Modal />
      }
      <Routes>
        <Route 
          path='*'
          element={<NotFound />} 
        />
        <Route 
          path='/' 
          element={<Home />} 
        />
        <Route 
          path='profile/:userId' 
          element={<Profile />} 
        />
        <Route 
          path='profile/settings'
          element={<Settings />}
        />
      </Routes>
    </Fragment>
  );
}

export default App;
