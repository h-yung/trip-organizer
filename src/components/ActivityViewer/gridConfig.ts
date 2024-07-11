import {
	CellClickedEvent,
	ColDef,
	GetQuickFilterTextParams,
	ValueFormatterParams,
	ValueGetterParams,
} from "ag-grid-community";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ActionItem } from "../../utils/interfaces";

export const defaultColDefs = {
	sortable: true,
	resizable: false,
	menuTabs: [],
	suppressMovable: true,
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
		console.log("clicked");
		const { data } = p;
		setSelectedActivity(data);
		console.log(data);
		console.log(`/trip/${viewTrip}/activity/detail/${data._id}`);
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
					hide: true,
					onCellClicked,
					valueFormatter: (p: ValueFormatterParams) => {
						if (!p.value) return "Unscheduled";
						dayjs.extend(localizedFormat);
						return dayjs(p.value).format("L LT") ?? p.value;
					},
					//2024-08-16T12:00:00Z this is ISO 8601
				},
				{
					headerName: "Title",
					field: "title",
					width: 300,
					headerClass: ["left-align", "scale-up", "header-text"],
					cellClass: ["left-align", "scale-up"],
					valueGetter: (p: ValueGetterParams) => {
						if (!p.data?.startTime)
							return `UNSCHEDULED: ${p.data.title}`;
						else return p.data.title;
					},
					onCellClicked,
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
