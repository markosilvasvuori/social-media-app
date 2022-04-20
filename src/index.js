import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './store/auth-context';
import { UserProvider } from './store/user-context';
import { PostProvider } from './store/post-context';
import { ModalProvider } from './store/modal-context';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ModalProvider>
        <UserProvider>
          <PostProvider>      
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PostProvider>
        </UserProvider>
      </ModalProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);