import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "antd";
import { HomeOutlined, CarOutlined, SmileOutlined } from "@ant-design/icons";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import PrepOutlined from "../../assets/noun-notes-6829221.svg";
import ClearOutlined from "../../assets/noun-clear-4706196.svg";
import { ActionItem, User } from "../../utils/interfaces";
// import ExpenseEntryForm from "../ExpenseViewer/expenseForm";
import ActivityDetail from "../activityDetail/ActivityDetail";
import { getAllActivity } from "../../apis/main";
import { GridApi, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css"; 
import "./activityViewer.scss";

import { actGridOptions, defaultColDefs, useColDefs } from "./gridConfig";
import { sampleActivities } from "../../utils/sampleData";

const ENV = import.meta.env.VITE_MODE;


interface ActivityViewerProps {
    user: User;
    viewTrip: string;
}

const ActivityViewer = ({
    user,
    viewTrip
}: ActivityViewerProps) => {

    const activityRef = useRef<GridApi<ActionItem>>(); //MutableRefObject<GridApi<ActionItem> | undefined >
    // const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showActivityDetail, setShowActivityDetail] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<ActionItem | null>(null);

    const [rowData, setRowData] = useState<ActionItem[]>([]);
    const [ categoryFilter, setCategoryFilter ] = useState(""); 
    const disableClearBtn = useMemo(()=> categoryFilter==="", [categoryFilter]);

    // const toggleFormVisibility = () => { setShowExpenseForm(!showExpenseForm)};

    const onGridReady = (params:GridReadyEvent) => { activityRef.current = params.api; };
    const columnDefs = useColDefs(setSelectedActivity, setShowActivityDetail);


    useEffect(()=> {

        async function getActivities(){
            if (viewTrip){

                if (ENV === "dev"){
                    setRowData(sampleActivities);
                    return;
                }

                const activities = await getAllActivity(viewTrip);

                const { documents } = activities;
                setRowData(documents);
                console.log(documents);
            }
        }
       getActivities();

    }, [viewTrip, 
        showActivityDetail, //inelegant, but there is a chance that user has edited an activity since visiting the detail bc workflow. 

    ])

    return (
        <div className="activity-viewer">
            {/* <h1>Activity Viewer {user.displayName} {user.trips.find(trip => trip.tripName === viewTrip)!.role}</h1> */}
           
           { !showActivityDetail ? (
            <>
                <div className="controls-activity">
              {/* {ENV === "dev" &&  <Button className="filter-btn" onClick={()=> setCategoryFilter("test")} shape="circle" ><SmileOutlined style={{color: "black"}} /></Button>} */}
                <Button className="filter-btn" onClick={()=> setCategoryFilter("activity")} size="large"  shape="circle" ><CarOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("food")} size="large"  shape="circle" ><img width={55} height={55} src={FoodOutlined} alt="food" /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("lodging")} size="large"  shape="circle"><HomeOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("prep")} size="large"  shape="circle"><img width={50} height={50} src={PrepOutlined} alt="preparations" /></Button> {/* more of a to-do list item, maybe V2*/}
               <Button className="filter-btn" onClick={()=> setCategoryFilter("")} size="large" disabled={disableClearBtn} shape="circle"><img width={45} height={45} src={ClearOutlined} alt="clear filter" /></Button>
                    
            </div>
            <div style={{display: "flex", color: "red", marginBottom: "0.5rem"}}>
                <label className="titles">Activities</label>
            </div>

            <div className="ag-theme-material activity-grid">
                <AgGridReact
                    onGridReady={onGridReady}
                    rowData={rowData}
                    defaultColDef={defaultColDefs}
                    gridOptions={actGridOptions}
                    getRowId={(p) => p.data._id}
                    columnDefs={columnDefs}
                    quickFilterText={categoryFilter}
                />
            </div>
            </>
           ) : (
            
                <ActivityDetail 
                    setSelectedActivity={setSelectedActivity} 
                    selectedActivity={selectedActivity} 
                    setShowActivityDetail={setShowActivityDetail} 
                    user={user}
                    viewTrip={viewTrip} //need for UpdateEntry
                 />
            
           ) }
            
            {/* <Button type="primary" onClick={toggleFormVisibility}>{showExpenseForm ? "Hide form" : "Add trip expense"}</Button>
            {showExpenseForm && <ExpenseEntryForm />} */}
        </div>
    )
}

export default ActivityViewer;