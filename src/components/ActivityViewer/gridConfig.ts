import { useMemo } from "react";
import {
	CellClassParams,
	CellClickedEvent,
	CellDoubleClickedEvent,
	ColDef,
	GetQuickFilterTextParams,
	ValueFormatterParams,
} from "ag-grid-community";
import { ActionItem } from "../../utils/interfaces";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

export const defaultColDefs = {
	sortable: true,
	resizable: false,
	menuTabs: [],
	// onCellClicked: (p: CellClickedEvent) => console.log(p.data.category),
};

export const actGridOptions = {
	includeHiddenColumnsInQuickFilter: true,
	// rowHeight: 50,
};

export const useColDefs = (
	setSelectedActivity: (p: null | ActionItem) => void,
	setShowActivityDetail: (p: boolean) => void
) => {
	const onCellDoubleClicked = (p: CellDoubleClickedEvent) => {
		const { data } = p;
		setSelectedActivity(data);
		setShowActivityDetail(true);
	};

	return useMemo(
		() => [
			{
				headerName: "Date-Time",
				field: "startTime",
				width: 270,
				headerClass: ["left-align", "scale-up", "header-text"],
				cellClass: ["left-align", "scale-up"],
				onCellDoubleClicked,
				valueFormatter: (p: ValueFormatterParams) => {
					if (!p.value) return p.value;
					// dayjs(p.value).format("MM/DD/YYYY h:mm A");
					dayjs.extend(localizedFormat);
					return dayjs(p.value).format("L LT") ?? p.value;
				},
				//2024-08-16T12:00:00Z this is ISO 8601
			},
			{
				headerName: "Title",
				field: "title",
				width: 600,
				headerClass: ["left-align", "scale-up", "header-text"],
				cellClass: ["left-align", "scale-up"],
				onCellDoubleClicked,
			},
			{
				headerName: "Category",
				field: "category",
				getQuickFilterText: (p: GetQuickFilterTextParams) => p.value,
				hide: true,
			},
			{
				headerName: "Submitted by",
				field: "submittedBy",
				hide: true,
			},
		],
		[]
	);
};
