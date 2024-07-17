import { Select } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useUserContext } from "../utils/UserContext";
import "./timezoneSelector.scss";

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
			<label className="titles">Timezone</label>
			<Select
				showSearch
				style={{ width: "100%", fontSize: "1rem" }}
				onChange={handleChange}
				options={options}
				defaultValue={defaultVal}
				size="large"
			></Select>
		</div>
	);
};
