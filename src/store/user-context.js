import { createContext, useEffect, useState } from 'react';
import { auth, firestoreDB } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const UserContext = createContext('');

export const UserProvider = (props) => {
    const [user, setUser] = useState(null);

    const getUserData = async () => {
        const user = auth.currentUser;
        const docRef = doc(firestoreDB, 'users', user.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            // console.log(docSnapshot.data());
            setUser(docSnapshot.data());
        } else {
            console.log('No such document!');
        }
    };

    useEffect(() => {
        console.log(user)
    }, [user]);

    const userCtx = {
        getUserData: getUserData,
        user: user,
    };

    return (
        <UserContext.Provider value={{userCtx}}>
            {props.children}
        </UserContext.Provider>
    );
};