import jsesc from "jsesc";
import { ExpenseItem } from "../utils/interfaces";
const {
	VITE_ADD_EXPENSE,
	VITE_DELETE_EXPENSE,
	VITE_GET_AIC,
	VITE_GET_EXPENSE_ALL,
	VITE_GET_USER_ALL,
	VITE_GET_ACTIVITY_ALL,
} = import.meta.env;

export const getAllUsers = async () => {
	const url = VITE_GET_USER_ALL;
	const response = await fetch(url);
	return await response.json();
};

export const getAllActivity = async (collectionName: string) => {
	const url = `${VITE_GET_ACTIVITY_ALL}?collectionName=${collectionName}`;
	const response = await fetch(url);
	return await response.json();
};

export const getAllExpenses = async (trip: string) => {
	const url = `${VITE_GET_EXPENSE_ALL}?trip=${trip}`;
	const response = await fetch(url);
	return await response.json();
};

export const getAicArt = async (query: string) => {
	const url = `${VITE_GET_AIC}?trip=${query}`;
	const response = await fetch(url);
	return await response.json();

	/**
    {
        image_id,
        title,
        artist_title,
        date_display,
        alt_text,
        url: singleRes.url,
    }
     */
};

export const deleteExpense = async (expenseId: string) => {
	const url = `${VITE_DELETE_EXPENSE}?itemId=${jsesc(expenseId)}`;
	const response = await fetch(url);
	return await response.json();
};

//nonfunc
export const addExpense = async (expenseItem: ExpenseItem) => {
	//tbc
	console.log("add exp item:", jsesc(expenseItem));
	// const url = `${VITE_GET_ACTIVITY_ALL}?itemId=${jsesc(expenseId)}`;
	// const response = await fetch(url);
	// return await response.json();
	// return content;
};
