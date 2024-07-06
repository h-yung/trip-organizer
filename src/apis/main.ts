import jsesc from "jsesc";
import { ActionItem, ExpenseItem } from "../utils/interfaces";
const {
	VITE_ADD_EXPENSE,
	VITE_DELETE_EXPENSE,
	VITE_GET_AIC,
	VITE_GET_EXPENSE_ALL,
	VITE_GET_USER_ALL,
	VITE_GET_ACTIVITY_ALL,
	VITE_DELETE_ACTION,
	VITE_UPDATE_ACTION,
	VITE_ADD_ACTION,
	VITE_UPDATE_EXPENSE,
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

export const getAicArt = async (query?: string) => {
	const url = `${VITE_GET_AIC}?trip=${query ?? ""}`;
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

//deletedCount
export const deleteExpense = async (expenseId: string) => {
	const url = `${VITE_DELETE_EXPENSE}?itemId=${jsesc(expenseId)}`;
	const response = await fetch(url);
	return await response.json();
};

//insertedId
export const addExpense = async (expenseItem: ExpenseItem) => {
	const config = {
		method: "POST",
		body: JSON.stringify({ document: expenseItem }),
	};

	const url = `${VITE_ADD_EXPENSE}`;
	const response = await fetch(url, config);
	return await response.json();
};

//matchedCount, ModifyCount
export const updateExpense = async (expenseItem: ExpenseItem) => {
	const document = JSON.parse(JSON.stringify(expenseItem));
	const { _id } = document;
	delete document._id;

	const config = {
		method: "POST",
		body: JSON.stringify(document),
	};

	const url = `${VITE_UPDATE_EXPENSE}?itemId=${jsesc(_id)}`;
	const response = await fetch(url, config);
	return await response.json();
};

//deletedCount
export const deleteActivity = async (activityId: string) => {
	const url = `${VITE_DELETE_ACTION}?itemId=${jsesc(activityId)}`;
	const response = await fetch(url);
	return await response.json();
};

//insertedId
export const addActivity = async (
	activity: ActionItem,
	collectionName: string
) => {
	const config = {
		method: "POST",
		body: JSON.stringify({ document: activity }),
	};

	const url = `${VITE_ADD_ACTION}?collectionName=${jsesc(collectionName)}`;
	const response = await fetch(url, config);
	return await response.json();
};

//matchedCount, ModifyCount
export const updateAction = async (
	activity: ActionItem,
	collectionName: string
) => {
	const document = JSON.parse(JSON.stringify(activity));
	const { _id } = document;
	delete document._id;

	const config = {
		method: "POST",
		body: JSON.stringify(document),
	};

	const url = `${VITE_UPDATE_ACTION}?itemId=${jsesc(
		_id
	)}&collectionName=${jsesc(collectionName)}`;
	const response = await fetch(url, config);
	return await response.json();
};
