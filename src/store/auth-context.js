import { createContext, useState } from 'react';

export const AuthContext = createContext('');

export const AuthProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const ctxValue = {
        isLoggedIn: isLoggedIn,
    };

    return (
        <AuthContext.Provider value={{ctxValue}}>
            {props.children}
        </AuthContext.Provider>
    );
};