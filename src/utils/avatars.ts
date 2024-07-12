import crow from "../assets/crow.svg";
import bugs from "../assets/bugs.svg";
import dolphin from "../assets/dolphin.svg";
import horse from "../assets/equestrian-statue.svg";
import bear from "../assets/fullbear.svg";
import hippo from "../assets/hippo.svg";
import monkey from "../assets/monkey.svg";
import raccoon from "../assets/raccoon.svg";
import lion from "../assets/lion.svg";
import kiwiBird from "../assets/kiwi-bird.svg";
import { AvatarItem, User } from "./interfaces";

export const avatarDictionary: AvatarItem[] = [
	{
		ref: "crow",
		svg: crow,
	},
	{
		ref: "bugs",
		svg: bugs,
	},
	{
		ref: "dolphin",
		svg: dolphin,
	},
	{
		ref: "horse",
		svg: horse,
	},
	{
		ref: "bear",
		svg: bear,
	},
	{
		ref: "hippo",
		svg: hippo,
	},
	{
		ref: "monkey",
		svg: monkey,
	},
	{
		ref: "raccoon",
		svg: raccoon,
	},
	{
		ref: "lion",
		svg: lion,
	},
	{
		ref: "kiwiBird",
		svg: kiwiBird,
	},
];

export const getAvatar = (user: User) => {
	return (
		avatarDictionary.find(({ ref }: AvatarItem) => ref === user.avatarRef)
			?.svg ?? undefined
	);
};
