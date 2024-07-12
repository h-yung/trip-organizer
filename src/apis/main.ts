import jsesc from "jsesc";
import { ActionItem, ExpenseItem, TripReview } from "../utils/interfaces";
const {
	VITE_GET_AIC,
	VITE_GET_ALL,
	VITE_ADD_ONE,
	VITE_UPDATE_ONE,
	VITE_DELETE_ONE,
	VITE_GET_REVIEW_TRIP_USER,
	VITE_AUTHENTICATE,
} = import.meta.env;

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

export const getAllUsers = async () => {
	const url = `${VITE_GET_ALL}?collection=trip_users`;
	const response = await fetch(url);
	return await response.json();
};

//placeholder...
export const authenticate = async (lookupName: string, password: string) => {
	const url = `${VITE_AUTHENTICATE}`;
	const config = {
		method: "POST",
		body: JSON.stringify({
			document: {
				lookupName,
				password,
			},
		}),
	};
	const response = await fetch(url, config);
	return await response.json();
};

export const getAllExpenses = async (trip: string) => {
	const url = `${VITE_GET_ALL}?trip=${trip}&collection=trip_expenses`;
	const response = await fetch(url);
	return await response.json();
};

//deletedCount
export const deleteExpense = async (expenseId: string) => {
	const url = `${VITE_DELETE_ONE}?itemId=${jsesc(
		expenseId
	)}&collection=trip_expenses`;
	const response = await fetch(url);
	return await response.json();
};

//insertedId
export const addExpense = async (expenseItem: ExpenseItem) => {
	const config = {
		method: "POST",
		body: JSON.stringify({ document: expenseItem }),
	};

	const url = `${VITE_ADD_ONE}?collection=trip_expenses`;
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

	const url = `${VITE_UPDATE_ONE}?itemId=${jsesc(
		_id
	)}&collection=trip_expenses`;
	const response = await fetch(url, config);
	return await response.json();
};

export const getAllActivity = async (tripName: string) => {
	const url = `${VITE_GET_ALL}?trip=${tripName}&collection=trip_activities`;
	const response = await fetch(url);
	return await response.json();
};

//deletedCount
export const deleteActivity = async (activityId: string) => {
	const url = `${VITE_DELETE_ONE}?itemId=${jsesc(
		activityId
	)}&collection=trip_activities`;
	const response = await fetch(url);
	return await response.json();
};

//insertedId
export const addActivity = async (activity: ActionItem) => {
	const config = {
		method: "POST",
		body: JSON.stringify({ document: activity }),
	};

	const url = `${VITE_ADD_ONE}?collection=trip_activities`;
	const response = await fetch(url, config);
	return await response.json();
};

//matchedCount, ModifyCount
export const updateAction = async (activity: ActionItem) => {
	const document = JSON.parse(JSON.stringify(activity));
	const { _id } = document;
	delete document._id;

	const config = {
		method: "POST",
		body: JSON.stringify(document),
	};

	const url = `${VITE_UPDATE_ONE}?itemId=${jsesc(
		_id
	)}&collection=trip_activities`;
	const response = await fetch(url, config);
	return await response.json();
};

export const getTripReviewForUser = async (
	tripName: string,
	userId: string
) => {
	const url = `${VITE_GET_REVIEW_TRIP_USER}?trip=${tripName}&userId=${userId}`;
	const response = await fetch(url);
	return await response.json();
};

//deletedCount
export const deleteTripReview = async (reviewId: string) => {
	const url = `${VITE_DELETE_ONE}?itemId=${jsesc(
		reviewId
	)}&collection=trip_reviews`;
	const response = await fetch(url);
	return await response.json();
};

//insertedId
export const addTripReview = async (review: TripReview) => {
	const config = {
		method: "POST",
		body: JSON.stringify({ document: review }),
	};

	const url = `${VITE_ADD_ONE}?collection=trip_reviews`;
	const response = await fetch(url, config);
	return await response.json();
};

//matchedCount, ModifyCount
export const updateTripReview = async (review: TripReview) => {
	const document = JSON.parse(JSON.stringify(review));
	const { _id } = document;
	delete document._id;

	const config = {
		method: "POST",
		body: JSON.stringify(document),
	};

	const url = `${VITE_UPDATE_ONE}?itemId=${jsesc(
		_id
	)}&collection=trip_reviews`;
	const response = await fetch(url, config);
	return await response.json();
};
