import { createContext, useState } from "react";

export const MenuModalContext = createContext('');

export const MenuModalProvider = (props) => {
    const [menu, setMenu] = useState(false);
    const [menuContent, setMenuContent] = useState(null);
    
    const menuHandler = (content) => {
        document.body.classList.toggle('no-scroll');
        setMenu(!menu);
        if(content) {
            setMenuContent(content);
        };
    };

    const menuModalCtx = {
        menuHandler: menuHandler,
        menu: menu,
        menuContent: menuContent,
    };
    
    return (
        <MenuModalContext.Provider value={{menuModalCtx}}>
            {props.children}
        </MenuModalContext.Provider>
    );
};