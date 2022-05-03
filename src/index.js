import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import { AuthProvider } from './store/auth-context';
import { UserProvider } from './store/user-context';
import { PostProvider } from './store/post-context';
import { ModalProvider } from './store/modal-context';
import { MenuModalProvider } from './store/menu-modal-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <ModalProvider>
          <PostProvider>  
            <MenuModalProvider>    
              <HashRouter>
                <App />
              </HashRouter>
            </MenuModalProvider>
          </PostProvider>
        </ModalProvider>
      </UserProvider>
    </AuthProvider>
  // </React.StrictMode>
);