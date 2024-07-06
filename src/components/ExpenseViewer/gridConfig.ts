import { useMemo } from "react";
import {
	CellClickedEvent,
	CellDoubleClickedEvent,
	GetQuickFilterTextParams,
	ValueFormatterParams,
	ValueSetterParams,
} from "ag-grid-community";
import { ExpenseItem, isValidCategory } from "../../utils/interfaces";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

import {
	BinCellRenderer,
	EditorCellRenderer,
} from "../../modules/customCellRenderer";

export const defaultColDefs = {
	sortable: true,
	resizable: false,
	menuTabs: [],
	headerClass: ["left-align", "scale-up", "header-text"],
	cellClass: ["left-align", "scale-up"],
	onCellClicked: (p: CellClickedEvent) => console.log(p.node),
};

export const expGridOptions = {
	includeHiddenColumnsInQuickFilter: true,
	// editType: "fullRow",
	// rowHeight: 50,
};

export const useColDefs = (
	selectedExpense: ExpenseItem | null,
	setSelectedExpense: (p: null | ExpenseItem) => void,
	editingEx: boolean,
	setEditingEx: (p: boolean) => void,
	setRowData: (p: ExpenseItem[]) => void,
	viewTrip: string
	// setShowExpenseForm: (p: boolean) => void
) => {
	const onCellDoubleClicked = () => {
		setEditingEx(!editingEx);
	};

	const onBinCellDoubleClicked = async () => {
		console.log("Delete for real?");
	};

	// const onEditorCellDoubleClicked = (p: CellDoubleClickedEvent) => {
	// 	//reverse the mode if already active... not that this should be visible in UI
	// 	if (editingEx) {
	// 		setEditingEx(false);
	// 		return;
	// 	}

	// 	if (!p.data) return;
	// 	setEditingEx(true);
	// 	//get the selected expense
	// 	const { data } = p;
	// 	setSelectedExpense(data);
	// 	setShowExpenseForm(true);
	// };

	return useMemo(
		() => [
			// {
			// 	headerName: "",
			// 	field: "editor",
			// 	width: 70,
			// 	onCellDoubleClicked: onEditorCellDoubleClicked,
			// 	cellRenderer: EditorCellRenderer,
			// },
			{
				headerName: "",
				field: "binGate",
				width: 70,
				onCellDoubleClicked: onBinCellDoubleClicked,
				cellRenderer: BinCellRenderer,
				cellRendererParams: {
					editingEx,
					setRowData,
					viewTrip,
				},
			},
			{
				headerName: "Category",
				//
				field: "category",
				onCellDoubleClicked,
				editable: editingEx,
				getQuickFilterText: (p: GetQuickFilterTextParams) => p.value,

				valueSetter: (p: ValueSetterParams) => {
					if (!p.newValue) return false;
					if (p.newValue) {
						if (isValidCategory(p.newValue.toLowerCase())) {
							p.data.category = p.newValue;
							return isValidCategory(p.newValue.toLowerCase());
						}
						return false;
					}
				},
				// hide: true,
				// cellClass: ["select-ag-cell"],
				// cellRenderer: CategoryCellRenderer,
				// cellRendererParams: {
				// 	setSelectedExpense,
				// 	selectedExpense,
				// 	editingEx,
				// },
			},
			{
				headerName: "Description",
				editable: editingEx,
				field: "desc",
				onCellDoubleClicked,
				width: 300,
			},
			{
				headerName: "in",
				editable: editingEx,
				field: "currency",
				onCellDoubleClicked,
				width: 100,
			},
			{
				headerName: "Cost",
				editable: editingEx,
				field: "value",
				onCellDoubleClicked,
				width: 150,
				cellClass: ["right-align", "scale-up"],
				//valueformatter would depend on currency. tbc
				valueFormatter: (p: ValueFormatterParams) => {
					let numFmted; //also not dealing with 0,0.0a
					if (!p.value) return p.value;
					const [whole, dec] = p.value.toString().split(".");
					if (!dec) numFmted = `${whole}.00`;
					else if (dec) {
						if (dec.length === 2) numFmted = `${whole}.${dec}`;
						else if (dec.length === 1)
							numFmted = `${whole}.${dec}0`;
					}
					return numFmted;

					// 	// if (!p.data.currency) return numFmted;
				},
			},
			{
				headerName: "Date",
				field: "date",
				editable: editingEx,
				onCellDoubleClicked,
				width: 270,
				//valueSetter

				valueFormatter: (p: ValueFormatterParams) => {
					if (!p.value) return p.value;
					// dayjs(p.value).format("MM/DD/YYYY h:mm A");
					dayjs.extend(localizedFormat);
					return dayjs(p.value).format("L LT") ?? p.value;
				},
			},
			{
				headerName: "Owner",
				editable: editingEx,
				field: "submittedBy",
				onCellDoubleClicked,
				width: 250,
				filter: true,
				valueFormatter: (p: ValueFormatterParams) => {
					if (!p.value) return;
					const reformattedBcShouldveUsedDisplayName =
						p.value.split("_");
					const fixed: string[] = [];
					for (const nameFg of reformattedBcShouldveUsedDisplayName) {
						const temp =
							nameFg[0].toUpperCase() +
							nameFg.split("").slice(1).join("");
						fixed.push(temp);
					}
					return fixed.join(" ");
				},
			},
			{
				headerName: "Details",
				editable: editingEx,
				onCellDoubleClicked,
				headerClass: ["header-text"],
				children: [
					{
						headerName: "More Info",

						field: "details",
						// columnGroupShow: "closed",
					},
					{
						headerName: "Vendor",

						onCellDoubleClicked,
						field: "vendor.name",
						width: 300,
						columnGroupShow: "open",
						//maybe collapsible
					},
				],
				//maybe collapsible
			},
		],
		[selectedExpense, setSelectedExpense, editingEx, setEditingEx]
	);
};
