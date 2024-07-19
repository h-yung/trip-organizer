import { Dayjs } from "dayjs";

const categories = ["food", "lodging", "activity", "prep", "test"] as const;

export type Category = (typeof categories)[number];
type Role = "participant" | "admin" | "readOnly";

//conv
export const isValidCategory = (x: any): x is Category =>
	categories.includes(x);

type AvatarOptions =
	| "monkey"
	| "crow"
	| "bugs"
	| "dolphin"
	| "horse"
	| "bear"
	| "hippo"
	| "raccoon"
	| "lion"
	| "kiwiBird";

interface Vendor {
	name: string;
	url?: string;
	email?: string;
	phoneNumber?: number;
}

interface ItemRating {
	title: string; //activity title
	id: string; //activity _id
	rating: number;
}

export interface TripReview {
	_id?: string;
	itemRatings: ItemRating[];
	comment: string;
	recommend: boolean;
	tripName: string;
	submittedBy: string; //user lookup name.  this is the compromise of not using relational DB - not fetching endlessly for a readable user name.
	submittedByUserId: string; //user _id
}

export interface TripRecord {
	tripName: string; //should convert to an id... and the database to a collection...
	role: Role[];
	// review?: //moved out. for now, triprecord is attached to the User doc.
}

export interface User {
	_id: string;
	displayName: string;
	lookupName: string;
	createdDate: string; //"YYYYMMDD"
	lastUpdatedDate?: string;
	avatarRef: AvatarOptions; //string
	trips: TripRecord[];
	avatar?: string; //this is assigned from front-end
}

export interface AvatarItem {
	ref: string;
	svg: string;
}

export interface ExpenseItem {
	_id?: string;
	category: Category;
	date: Date;
	currency: string;
	desc: string;
	details?: string;
	vendor?: Vendor; //maybe
	value: number;
	submittedBy: string; //user.lookupName
	trip: string;
}

export interface ActionItem {
	_id?: string;
	category: Category;
	submittedBy?: string; //user.lookupName
	trip: string; //replace with tripId...
	startTime?: Date; //check ...
	title: string;
	details: string;
	tz?: string; //suggest by location... determine whether/how to accept tz shown when user updates/enters
	location: {
		//tbd
		mapUrl: string; //link
		address: string;
		country: string; //remove requirement?
		countryCode?: string;
		nearestCity: string;
		nearestState?: string; //remove requirement?
		zipcode?: number;
	};

	advisory?: string; //special instructions, cautions, reviews
	urls: string[]; //cite your sources lol
	vendor?: Vendor;
}

export interface ActivityUpdateFormValues {
	_id?: string;
	address: string;
	advisory: string | undefined;
	title: string;
	startTime: Dayjs | undefined;
	category: string;
	urls: string[];
	country: string;
	mapUrl: string;
	nearestCity: string;
	nearestState: string | undefined;
	zipcode: number | undefined;
	tz: string | undefined;
	countryCode: string | undefined;
	details: string;
	//vendor
	email: string | undefined;
	name: string | undefined;
	phoneNumber: number | undefined;
	url: string | undefined;
}

export interface Image {
	image_id: string;
	title: string;
	artist_title: string;
	date_display: string;
	alt_text: string;
	url: string;
}

export interface CityObj {
	name: string;
	lat: string; //float
	lng: string; //float
	country: string;
	admin1: string;
	admin2: string;
}

export interface TzResponse {
	latitude: number;
	longitude: number;
	location: string; //country, "Austria"
	country_iso: string; //"AT",
	iana_timezone: string; //"Europe/Vienna",
	timezone_abbreviation: string; //"CET",
	dst_abbreviation: string; //"CEST",
	offset: string; //"UTC+1",
	dst_offset: string; // "UTC+2",
	current_local_datetime: string; //"2023-09-19T18:06:11.57",
	current_utc_datetime: string; //"2023-09-19T16:06:11.570Z"
}
