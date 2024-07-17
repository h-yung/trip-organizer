import { createContext, useContext, useState } from "react";
import { ActionItem, User } from "./interfaces";

type IUserContext = {
	activeUsr: User | null;
	setActiveUsr: React.Dispatch<React.SetStateAction<User | null>>;
	viewTrip: string;
	setViewTrip: React.Dispatch<React.SetStateAction<string>>;
	selectedActivity: ActionItem | null;
	setSelectedActivity: React.Dispatch<
		React.SetStateAction<ActionItem | null>
	>;
	customTz: string;
	setCustomTz: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<IUserContext>({
	activeUsr: null,
	viewTrip: "",
	selectedActivity: null,
	setActiveUsr: () => {},
	setViewTrip: () => {},
	setSelectedActivity: () => {},
	customTz: "",
	setCustomTz: () => {},
});
export const useUserContext = () => useContext(UserContext);
