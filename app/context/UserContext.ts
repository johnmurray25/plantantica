"use client"
import { createContext } from "react";
import auth from "../../firebase/auth";

export default createContext(auth?.currentUser);