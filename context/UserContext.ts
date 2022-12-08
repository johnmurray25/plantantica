import { User } from "firebase/auth";
import { createContext } from "react";
import DBUser from "../domain/DBUser";

interface Auth {
    user: User;
    loading: boolean;
    dBUser: DBUser;
    profPicUrl: string;
    setProfPicUrl?: () => void;
}

const UserContext = createContext<Auth>(null);

export default UserContext