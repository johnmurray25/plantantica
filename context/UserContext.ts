import { User } from "firebase/auth";
import { createContext } from "react";

interface Auth {
    user: User;
    loading: boolean;
}

const UserContext = createContext<Auth>(null);

export default UserContext