import { Button, Select } from "antd";
import { useMemo } from "react";
import * as cityJson from "cities.json";
import dayjs from "dayjs";
import { useUserContext } from "../utils/UserContext";
import "./timezoneSelector.scss";
import { CityObj } from "../utils/interfaces";
import { getTz } from "../apis/main";

//until Typescript 5.1 ...
declare namespace Intl {
	type Key =
		| "calendar"
		| "collation"
		| "currency"
		| "numberingSystem"
		| "timeZone"
		| "unit";

	function supportedValuesOf(input: Key): string[];
}

interface TimeZoneSelectorProps {
	layout?: "horizontal" | "vertical"; //default is vertical, no additional class
}
export const TimezoneSelector = ({ layout }: TimeZoneSelectorProps) => {
	const { customTz, setCustomTz } = useUserContext();
	const options = useMemo(() => {
		const list = Intl.supportedValuesOf("timeZone");
		return list.map((tz) => ({
			value: tz,
			label: tz,
		}));
	}, []);

	const defaultVal = useMemo(() => customTz ?? dayjs.tz.guess(), [customTz]);

	const handleChange = (value: string) => {
		console.log(value);
		setCustomTz(value);
	};

	return (
		<div className={`tz-select-container ${layout}`}>
			{/* <label className="titles">Timezone</label> */}
			<Select
				showSearch
				style={{ width: "100%", fontSize: "1rem" }}
				onChange={handleChange}
				options={options}
				// defaultValue={defaultVal}
				value={customTz ?? defaultVal}
				size="large"
			></Select>
		</div>
	);
};

//to serve timezone selector/suggestor. for some reason cannot import a Select into form and have it acknowledged by form item name
export const getCityOptions = () => {
	const cities: CityObj[] = cityJson[
		"default" as keyof object
	] as unknown as CityObj[]; //ridic typescript issue

	return cities
		.sort((a, b) => {
			return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
		})
		.map((cityObj: CityObj) => ({
			value: `${JSON.stringify(cityObj)}`,
			label: (
				<>
					<span style={{ fontWeight: "bold" }}>{cityObj.name}, </span>
					<span>
						{cityObj.country === "US"
							? `${cityObj.admin1}, ${cityObj.country}`
							: cityObj.country}
					</span>
				</>
			),
		}));
};
