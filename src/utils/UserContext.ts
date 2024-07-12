import { createContext, useContext, useState } from "react";
import { ActionItem, User } from "./interfaces";

type IUserContext = {
	activeUsr: User | null;
	setActiveUsr: React.Dispatch<React.SetStateAction<User | null>>;
	viewTrip: string;
	setViewTrip: React.Dispatch<React.SetStateAction<string>>;
	rowData: ActionItem[];
	setRowData: React.Dispatch<React.SetStateAction<ActionItem[]>>;
	selectedActivity: ActionItem | null;
	setSelectedActivity: React.Dispatch<
		React.SetStateAction<ActionItem | null>
	>;
};

export const UserContext = createContext<IUserContext>({
	activeUsr: null,
	viewTrip: "",
	rowData: [],
	selectedActivity: null,
	setActiveUsr: () => {},
	setViewTrip: () => {},
	setRowData: () => {},
	setSelectedActivity: () => {},
});
export const useUserContext = () => useContext(UserContext);
