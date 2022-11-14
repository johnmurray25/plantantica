"use client"
import { createContext } from "react";
import DBUser from "../../domain/DBUser";

export default createContext<DBUser>(null);