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
	location: {
		//tbd
		mapUrl: string; //link
		address: string;
		country: string;
		nearestCity: string;
		nearestState?: string;
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
