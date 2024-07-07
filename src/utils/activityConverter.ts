import dayjs from "dayjs";
import {
	ActionItem,
	ActivityUpdateFormValues,
	Category,
	isValidCategory,
	User,
} from "./interfaces";

export const convertActForForm = (
	activity: ActionItem
): ActivityUpdateFormValues => {
	const entry: ActivityUpdateFormValues = {
		address: activity.location.address,
		advisory: activity.advisory,
		title: activity.title,
		startTime: dayjs(activity.startTime),
		category: activity.category,
		urls: [...activity.urls],
		country: activity.location.country,
		mapUrl: activity.location.mapUrl,
		nearestCity: activity.location.nearestCity,
		nearestState: activity.location.nearestState,
		zipcode: activity.location.zipcode,
		details: activity.details,
		//vendor
		email: activity.vendor?.email,
		name: activity.vendor?.name,
		phoneNumber: activity.vendor?.phoneNumber,
		url: activity.vendor?.url,
	};

	//if an entry update
	if ("_id" in activity) entry._id = activity._id;

	return entry;
};

export const convertFormToAct = (
	actFormVals: ActivityUpdateFormValues,
	user: User,
	viewTrip: string,
	itemId?: string
): ActionItem => {
	const {
		address,
		advisory,
		title,
		startTime,
		category,
		urls,
		country,
		mapUrl,
		nearestCity,
		nearestState,
		zipcode,
		details,
		//vendor
		email,
		name,
		phoneNumber,
		url,
	} = actFormVals;

	const entry: ActionItem = {
		category: category as Category,
		submittedBy: user.lookupName,
		trip: viewTrip,
		startTime: startTime.toDate(), //to JavaScript Date object
		title,
		details,
		location: {
			mapUrl,
			address,
			country,
			nearestCity,
			nearestState,
			zipcode,
		},
		advisory,
		urls,
		vendor: {
			name: name ?? "",
			email,
			phoneNumber,
			url,
		},
	};

	//if an entry update
	if (itemId) entry._id = itemId;
	console.log();
	return entry;
};
