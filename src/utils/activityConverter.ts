import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getTz } from "../apis/main";
import {
	ActionItem,
	ActivityUpdateFormValues,
	Category,
	CityObj,
	TripReview,
	User,
} from "./interfaces";
import { sampleTzResponse } from "./sampleData";
import * as cityJson from "cities.json";

const ENV = import.meta.env.VITE_MODE;

export const convertActForForm = (
	activity: ActionItem,
	customTz: string
): ActivityUpdateFormValues => {
	dayjs.extend(utc);
	dayjs.extend(timezone);

	//need nearestCity to be converted into pre-parsed CityObj
	const cityList = cityJson[
		"default" as keyof object
	] as unknown as CityObj[];

	const { location } = activity;
	const cityData = cityList.find(({ name, country, admin1 }: CityObj) => {
		return activity.location.countryCode === "US"
			? name === location.nearestCity &&
					country === location.countryCode &&
					admin1 === location.nearestState
			: name === location.nearestCity && country === location.countryCode;
	});

	const cityDataStr = JSON.stringify(cityData);

	const entry: ActivityUpdateFormValues = {
		address: activity.location.address,
		advisory: activity.advisory,
		title: activity.title,
		startTime: activity.startTime
			? activity.tz
				? dayjs(activity.startTime).tz(activity.tz)
				: customTz
				? dayjs(activity.startTime).tz(customTz)
				: dayjs(activity.startTime)
			: undefined, //display should use customTz if specified
		category: activity.category,
		urls: activity.urls && activity.urls.length ? [...activity.urls] : [],
		country: activity.location.country,
		countryCode: activity.location.countryCode,
		// countryCode:
		mapUrl: activity.location.mapUrl,
		nearestCity: cityDataStr,
		// nearestCity: activity.location.nearestCity,
		nearestState: activity.location.nearestState,
		zipcode: activity.location.zipcode,
		details: activity.details,
		tz: activity.tz,
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
	customTz: string,
	itemId?: string
): ActionItem => {
	dayjs.extend(utc);
	dayjs.extend(timezone);

	console.log("preconvert", actFormVals);

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
		zipcode,
		details,
		//vendor
		email,
		name,
		phoneNumber,
		url,
	} = actFormVals;

	//convert nearestCity value into readable fields
	const cityData: CityObj = JSON.parse(nearestCity);
	const cityName = cityData.name;
	const countryCode = cityData.country;
	const state = cityData.admin1;

	const entry: ActionItem = {
		category: category as Category,
		submittedBy: user.lookupName,
		trip: viewTrip,
		startTime: startTime
			? // customTz ?
			  dayjs(startTime).tz(customTz, true).toDate()
			: // : dayjs(startTime).toDate()
			  undefined, //to JavaScript Date object
		title,
		details,
		location: {
			mapUrl,
			address,
			country,
			countryCode,
			nearestCity: cityName,
			nearestState: countryCode === "US" ? state : undefined,
			zipcode,
		},
		tz: customTz,
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

	console.log("converted", entry);
	return entry;
};

//remodel the tz response and city object into useful shape
export const retrieveTz = async (value: string) => {
	// setCustomTz(value);
	const selectedCity = JSON.parse(value);
	const { lat, lng, admin1, country } = selectedCity;

	if (ENV === "dev") {
		const res = sampleTzResponse;
		const { iana_timezone, location } = res;
		return { iana_timezone, admin1, location, country };
	}

	const res = await getTz(lat, lng);
	const { iana_timezone, location } = res;
	return { iana_timezone, admin1, location, country };
};

interface ReviewConvertParams {
	initValSet: Record<string, number | string | boolean>;
	user: User;
	tripName: string;
	activities: ActionItem[]; //also have to glue the activity.title back in :/
	reviewId?: string;
}

export const convertFormToReview = ({
	initValSet,
	user,
	tripName,
	activities, //also have to glue the activity.title back in :/
	reviewId,
}: ReviewConvertParams): TripReview => {
	const start = structuredClone(initValSet);
	delete start.comment;
	delete start.recommend;

	const ratings = [];

	for (const key in start) {
		//get the title back
		const { title } = activities.find(
			(action) => action._id === key.toString()
		)!;

		ratings.push({
			id: key.toString(),
			rating: initValSet[key] as number,
			title,
		});
	}
	const finishedReview: TripReview = {
		comment: initValSet.comment as string,
		recommend: initValSet.recommend as boolean,
		itemRatings: ratings,
		submittedBy: user.lookupName,
		submittedByUserId: user._id,
		tripName,
	};

	//if has _id
	if (reviewId) finishedReview._id = reviewId;

	return finishedReview;
};
