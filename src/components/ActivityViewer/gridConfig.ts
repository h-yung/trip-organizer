import {
	CellClickedEvent,
	ColDef,
	GetQuickFilterTextParams,
	ValueFormatterParams,
	ValueGetterParams,
} from "ag-grid-community";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ActionItem } from "../../utils/interfaces";
import { useUserContext } from "../../utils/UserContext";

export const defaultColDefs = {
	sortable: true,
	resizable: false,
	menuTabs: [],
	suppressMovable: true,
	headerClass: ["left-align", "scale-up", "header-text"],
	cellClass: ["left-align", "scale-up"],
	// onCellClicked: (p: CellClickedEvent) => console.log(p.data.category),
};

export const actGridOptions = {
	includeHiddenColumnsInQuickFilter: true,
	// rowHeight: 50,
};

export const useColDefs = (
	setSelectedActivity: (p: null | ActionItem) => void,
	viewTrip: string
) => {
	const navigate = useNavigate();
	const onCellClicked = (p: CellClickedEvent) => {
		// console.log("clicked");
		const { data } = p;
		setSelectedActivity(data);
		// console.log(data);
		// console.log(`/trip/${viewTrip}/activity/detail/${data._id}`);
		navigate(`/trip/${viewTrip}/activity/detail/${data._id}`);
	};

	return useMemo(
		() =>
			[
				{
					headerName: "Date-Time",
					field: "startTime",
					width: 180,
					initialSort: "desc",
					headerClass: ["left-align", "scale-up", "header-text"],
					cellClass: ["left-align", "scale-up"],
					// hide: true,
					onCellClicked,
					valueFormatter: (p: ValueFormatterParams) => {
						if (!p.value) return "Unscheduled";
						const timezone = p.data?.tz;
						return timezone
							? dayjs(p.value)
									.tz(timezone)
									.format("ddd MMM DD h:mm A (zzz)")
							: dayjs(p.value).format("ddd MMM DD h:mm A (zzz)");

						// dayjs.extend(localizedFormat);
						// return dayjs(p.value).format("L LT") ?? p.value;
					},
					//2024-08-16T12:00:00Z this is ISO 8601
				},
				{
					headerName: "Title",
					field: "title",
					width: 300,
					valueGetter: (p: ValueGetterParams) => {
						if (!p.data?.startTime)
							return `UNSCHEDULED: ${p.data.title}`;
						else return p.data.title;
					},
					onCellClicked,
				},
				{
					headerName: "Timezone",
					field: "tz",
					// getQuickFilterText: (p: GetQuickFilterTextParams) =>
					// 	p.value,
					hide: true,
				},
				{
					headerName: "Address",
					hide: true,
					field: "location.address",
				},
				{
					headerName: "City",
					hide: true,
					field: "location.city",
				},
				{
					headerName: "Zipcode",
					hide: true,
					field: "location.zipcode",
				},
				{
					headerName: "Vendor",
					hide: true,
					children: [
						{
							headerName: "Name",
							hide: true,
							field: "vendor.name",
						},
						{
							headerName: "Email",
							hide: true,
							field: "vendor.email",
						},
						{
							headerName: "Phone",
							hide: true,
							field: "vendor.phoneNumber",
						},
						{
							headerName: "URL",
							hide: true,
							field: "vendor.url",
						},
					],
				},
				{
					headerName: "Details",
					hide: true,
					field: "details",
				},
				{
					headerName: "Advisory",
					hide: true,
					field: "advisory",
				},
				{
					headerName: "Category",
					field: "category",
					getQuickFilterText: (p: GetQuickFilterTextParams) =>
						p.value,
					hide: true,
				},
				{
					headerName: "Submitted by",
					field: "submittedBy",
					hide: true,
				},
			] as ColDef<ActionItem>[], // | ColGroupDef<TData>)[],
		[]
	);
};
