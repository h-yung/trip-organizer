import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../utils/interfaces";
import { useSessionStorage } from "./useSessionStorage";

interface AuthContext {
	activeUsr: User | undefined;
	viewTrip: string;
}

const initialContext: AuthContext = {
	activeUsr: undefined,
	viewTrip: "",
};

const AuthContext = createContext<AuthContext>(initialContext);

const AuthProvider = ({ children }) => {
	const [token, setToken] = useSessionStorage("token", "");
};
