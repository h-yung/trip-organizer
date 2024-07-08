import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExpenseItem, User } from "../../utils/interfaces";
import { ColDef, GridApi, GridReadyEvent, RowValueChangedEvent } from "ag-grid-community";
import { defaultColDefs, expGridOptions, useColDefs } from "./gridConfig";
import { getAllExpenses, updateExpense } from "../../apis/main";
import { AgGridReact } from "ag-grid-react";
import { Button, ConfigProvider, Modal } from "antd";
import { HomeOutlined, CarOutlined, PushpinOutlined, SmileOutlined, CloseCircleOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { SampleExp } from "../../utils/sampleData";
import "./expenseViewer.scss";
import ExpenseEntry from "./expenseForm";
import { Link } from "react-router-dom";

const ENV = import.meta.env.VITE_MODE;

interface ExpenseViewerProps {
    viewTrip: string;
}


const ExpenseViewer = ({
    viewTrip,
}: ExpenseViewerProps) => {


    const expenseRef = useRef<GridApi<ExpenseItem>>(); //MutableRefObject<GridApi<ExpenseItem> | undefined >

    const [ openConfModal, setOpenConfModal ] = useState(false);

    const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

    const [ editingEx, setEditingEx ] = useState(false);

    const [rowData, setRowData] = useState<ExpenseItem[]>([]);
    const [ categoryFilter, setCategoryFilter ] = useState(""); 
    const disableClearBtn = useMemo(()=> categoryFilter==="", [categoryFilter]);


    const onGridReady = (params:GridReadyEvent) => { expenseRef.current = params.api; };
    const columnDefs = useColDefs(
        selectedExpense, 
        setSelectedExpense, 
        editingEx, 
        setEditingEx, 
        setRowData, 
        viewTrip,
    ) as ColDef[];

    const exportExpenses = useCallback(() => {
        if (expenseRef.current) {
            expenseRef.current.exportDataAsCsv();
        }

    }, [expenseRef]);


    const handleCancel = useCallback(async () => {
        setSelectedExpense(null);
        if (ENV === "dev"){
            setRowData(SampleExp);
            setOpenConfModal(false);
            return;
        } 
        const exps = await getAllExpenses(viewTrip);
        const { documents } = exps;
        setRowData(documents);
        setOpenConfModal(false);
    },[]);

    const handleOk = useCallback(async () => {

        console.log("selected exp at this time:", selectedExpense)

        if (!selectedExpense) {
            console.log("nothing to update");
            setOpenConfModal(false);
            return;
        }
        if (ENV === "dev"){
            // setRowData(SampleExp);
            console.log('UI stays same with the accepted edits');
            setOpenConfModal(false);
            return;
        } 
        const update = await updateExpense(selectedExpense);
        if (update.matchedCount && update.modifiedCount && update.matchedCount === update.modifiedCount) console.log('Successfully sent in update!')

        //now force refresh your data...although maybe not needed bc UI already has the update
        if (expenseRef.current) {
            expenseRef.current.applyTransaction({ update: [selectedExpense] });
        }
        setOpenConfModal(false);

    },[setRowData, expenseRef, updateExpense, selectedExpense]);

    const onRowValueChanged = (event:RowValueChangedEvent) => {
        //editing has stopped?
        event.api.stopEditing();
        const changedRowNode = event.api.getRowNode(event.data._id);
        console.log('changed row?')
        console.log(changedRowNode?.data);

        changedRowNode && setSelectedExpense(changedRowNode.data);

        //confirm to send for edits
        setOpenConfModal(true);
    }


    useEffect(()=> {

        async function getExps(){
            if (viewTrip){

                if (ENV === "dev"){
                    setRowData(SampleExp);
                    return;
                }

                const exps = await getAllExpenses(viewTrip);

                const { documents } = exps;
                setRowData(documents);
                // console.log(documents);
            }
        }
       getExps();

    }, [viewTrip, 
       //in case of successful insert, need to refresh list. isSuccess is in lower-level child component
     ])

    return (
        <ConfigProvider
            theme={{
                components: {
                Modal: {
                    titleFontSize: 18,
                },
                Button: {
                    defaultBg: "transparent",
                    defaultHoverBg: "transparent",
                    // defaultColor: "#00c28e",
                    // colorLinkHover: "#00c28e",
                    colorPrimary: "#00c28e"
                  },
                },
            }}
            >
       <div className="expense-viewer">
        <Modal title="Confirm updates?" width={200} open={openConfModal} onOk={handleOk} onCancel={handleCancel}>
      </Modal>
            <div className="controls-activity">
             {/* {ENV === "dev" &&  <Button className="filter-btn" onClick={()=> setCategoryFilter("test")} shape="circle" ><SmileOutlined style={{color: "black"}} /></Button>} */}
             <Button className="filter-btn" onClick={()=> setCategoryFilter("activity")} size="large"  shape="circle" ><CarOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("food")} size="large"  shape="circle" ><img style={{objectFit: "contain"}} width={48} height={48} src={FoodOutlined} alt="food" /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("lodging")} size="large"  shape="circle"><HomeOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("prep")} size="large"  shape="circle"><PushpinOutlined style={{color: "black"}} /></Button> {/* more of a to-do list item, maybe V2*/}
               <Button className="filter-btn" onClick={()=> setCategoryFilter("")} size="large" disabled={disableClearBtn} shape="circle"><CloseCircleOutlined style={{color: "black"}} /></Button>
                    
            </div>
            <>
                <div style={{display: "flex", color: "red", marginBottom: "0.5rem"}}>
                    <label className="titles">Expenses: Tap row to edit</label>
                </div>
                <div className="ag-theme-material expense-grid">
                    <AgGridReact
                        onGridReady={onGridReady}
                        rowData={rowData}
                        defaultColDef={defaultColDefs}
                        gridOptions={expGridOptions}
                        getRowId={(p) => p.data._id}
                        columnDefs={columnDefs}
                        quickFilterText={categoryFilter}
                        editType="fullRow"
                        onRowValueChanged={onRowValueChanged}
                    />
                </div>
            </>
            <div className="exp-group">
            
            <Button className="special-btn" onClick={exportExpenses}><DownloadOutlined /></Button>
            <Link to="/expenses-new" className="special-btn"><PlusOutlined /></Link>
            </div>
        </div>
        </ConfigProvider>
    )
}

export default ExpenseViewer;