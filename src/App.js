import { Fragment, useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContext } from './store/auth-context';
import { UserContext } from './store/user-context';
import Header from './components/Layout/Header';
import './App.css';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Modal from './components/Modal/Modal';
import { ModalContext } from './store/modal-context';

function App() {
  const {authCtx} = useContext(AuthContext);
  const {userCtx} = useContext(UserContext);
  const {modalCtx} = useContext(ModalContext);

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
      {modalCtx.modal &&
        <Modal />
      }
      <Routes>
        <Route 
          path='/' 
          element={<Home />} 
        />
        <Route 
          path='profile/:userId' 
          element={<Profile />} 
        />
      </Routes>
    </Fragment>
  );
}

export default App;
