import { createContext } from "react";
import { User } from "./interfaces";

interface IUserContext {
	activeUsr: User | null;
	setActiveUsr: (p: User | null) => void;
	viewTrip: string;
	setViewTrip: (p: string) => void;
}

const initialContext: IUserContext = {
	activeUsr: null,
	viewTrip: "",
	setActiveUsr: () => {},
	setViewTrip: () => {},
};

const UserContext = createContext<IUserContext>(initialContext);

export default UserContext;
