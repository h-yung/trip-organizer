type Category = "food" | "lodging" | "activity" | "prep" | "test";
type Role = "participant" | "admin" | "readOnly";

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

export interface TripRecord {
	tripName: string;
	role: Role;
}

export interface User {
	_id?: string;
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
	trip: string;
	startTime?: Date; //check ...
	title: string;
	details: string;
	location: {
		//tbd
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
