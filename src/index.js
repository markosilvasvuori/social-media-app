import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './store/auth-context';
import { UserProvider } from './store/user-context';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);