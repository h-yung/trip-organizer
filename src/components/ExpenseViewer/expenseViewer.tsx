import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExpenseItem, User } from "../../utils/interfaces";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { defaultColDefs, expGridOptions, useColDefs } from "./gridConfig";
import { getAllExpenses } from "../../apis/main";
import { AgGridReact } from "ag-grid-react";
import { Button } from "antd";
import { HomeOutlined, CarOutlined, SmileOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import PrepOutlined from "../../assets/noun-notes-6829221.svg";
import ClearOutlined from "../../assets/noun-clear-4706196.svg";
import { SampleExp } from "../../utils/sampleData";
import "./expenseViewer.scss";
import ExpenseEntry from "./expenseForm";

const ENV = import.meta.env.VITE_MODE;

interface ExpenseViewerProps {
    user: User;
    viewTrip: string;
    setShowExpenseViewer: (p:boolean) => void;
}

const ExpenseViewer = ({
    user,
    viewTrip,
    // setShowExpenseViewer
}: ExpenseViewerProps) => {

    const expenseRef = useRef<GridApi<ExpenseItem>>(); //MutableRefObject<GridApi<ExpenseItem> | undefined >
    const [showExpenseForm, setShowExpenseForm] = useState(false);

    const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

    const [ editingEx, setEditingEx ] = useState(false);

    const [rowData, setRowData] = useState<ExpenseItem[]>([]);
    const [ categoryFilter, setCategoryFilter ] = useState(""); 
    const disableClearBtn = useMemo(()=> categoryFilter==="", [categoryFilter]);

    // const toggleFormVisibility = () => { setShowExpenseForm(!showExpenseForm)};

    const onGridReady = (params:GridReadyEvent) => { expenseRef.current = params.api; };
    const columnDefs = useColDefs(
        selectedExpense, 
        setSelectedExpense, 
        editingEx, 
        setEditingEx, 
        setRowData, 
        viewTrip ) as ColDef[];

    const exportExpenses = useCallback(() => {
        if (expenseRef.current) {
            expenseRef.current.exportDataAsCsv();
        }

    }, [expenseRef]);


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
                console.log(documents);
            }
        }
       getExps();

    }, [viewTrip, 
        showExpenseForm //in case of successful insert, need to refresh list. isSuccess is in lower-level child component
     ])

    return showExpenseForm ? (
            <ExpenseEntry 
                setShowExpenseForm={setShowExpenseForm}
                viewTrip={viewTrip}
                user={user}
            />
    )

       : (
       <div className="expense-viewer">
            <div className="controls-activity">
              {ENV === "dev" &&  <Button className="filter-btn" onClick={()=> setCategoryFilter("test")} shape="circle" ><SmileOutlined style={{color: "black"}} /></Button>}
                <Button className="filter-btn" onClick={()=> setCategoryFilter("activity")} size="large"  shape="circle" ><CarOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("food")} size="large"  shape="circle" ><img width={55} height={55} src={FoodOutlined} alt="food" /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("lodging")} size="large"  shape="circle"><HomeOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("prep")} size="large"  shape="circle"><img width={50} height={50} src={PrepOutlined} alt="preparations" /></Button> {/* more of a to-do list item, maybe V2*/}
               <Button className="filter-btn" onClick={()=> setCategoryFilter("")} size="large" disabled={disableClearBtn} shape="circle"><img width={45} height={45} src={ClearOutlined} alt="clear filter" /></Button>
                    
            </div>
            <>
                <div style={{display: "flex", color: "red", marginBottom: "0.5rem"}}>
                    <label className="titles">Expenses</label>
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
                    />
                </div>
            </>
            <div className="exp-group">
            
            <Button className="special-btn" onClick={exportExpenses}><DownloadOutlined /></Button>
            <Button className="special-btn" onClick={()=> setShowExpenseForm(true)}><PlusOutlined /></Button>
            </div>
        </div>
       )
}

export default ExpenseViewer;