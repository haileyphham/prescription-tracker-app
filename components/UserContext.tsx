// UserContext.js
import React, {
    Dispatch,
    SetStateAction,
    createContext,
    useState,
} from "react";

// HARD CODED USER
const USER_ID = { id: "smart-1577780" };

const defaultUserContext: UserContextType = {
    user: USER_ID,
    setUser: () => {}, // You can replace this with a real implementation later
};

interface UserContextType {
    user: typeof USER_ID;
    setUser: Dispatch<SetStateAction<typeof USER_ID>>;
}

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(USER_ID);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
