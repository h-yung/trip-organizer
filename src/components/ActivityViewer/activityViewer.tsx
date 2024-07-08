import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ConfigProvider } from "antd";
import { HomeOutlined, CarOutlined, RightOutlined } from "@ant-design/icons";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import PrepOutlined from "../../assets/noun-notes-6829221.svg";
import ClearOutlined from "../../assets/noun-clear-4706196.svg";
import { ActionItem, TripReview, User } from "../../utils/interfaces";
// import ExpenseEntryForm from "../ExpenseViewer/expenseForm";
import ActivityDetail from "../activityDetail/ActivityDetail";
import { getAllActivity, getTripReviewForUser } from "../../apis/main";
import { GridApi, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css"; 
import "./activityViewer.scss";

import { actGridOptions, defaultColDefs, useColDefs } from "./gridConfig";
import { sampleActivities, sampleReviews } from "../../utils/sampleData";
import TripReviewer from "../TripReviewer/tripReviewer";

const ENV = import.meta.env.VITE_MODE;


interface ActivityViewerProps {
    user: User;
    viewTrip: string;
    reviewForm: boolean;
    setReviewForm: (p:boolean) => void;
}

const ActivityViewer = ({
    user,
    viewTrip,
    reviewForm,
    setReviewForm
}: ActivityViewerProps) => {

    const activityRef = useRef<GridApi<ActionItem>>(); //MutableRefObject<GridApi<ActionItem> | undefined >
    // const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showActivityDetail, setShowActivityDetail] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<ActionItem | null>(null);

    const [rowData, setRowData] = useState<ActionItem[]>([]);
    const [tripReview, setTripReview] = useState<TripReview | null>(null);
    const [ categoryFilter, setCategoryFilter ] = useState(""); 
    const disableClearBtn = useMemo(()=> categoryFilter==="", [categoryFilter]);

    // const toggleFormVisibility = () => { setShowExpenseForm(!showExpenseForm)};

    const onGridReady = (params:GridReadyEvent) => { activityRef.current = params.api; };
    const columnDefs = useColDefs(setSelectedActivity, setShowActivityDetail);

    const allowReview = useMemo(()=>{
      //if user was a trip participant
      return user?.trips.find(trip => trip.tripName === viewTrip)?.role.includes("participant");
    },[viewTrip])

    const startReview = () => { 
        setReviewForm(true);
    }


    useEffect(()=> {

        async function getActivities(){
            if (viewTrip){

                if (ENV === "dev"){
                    setRowData(sampleActivities.filter(activity => activity.trip === viewTrip)); //in prod the request passes the trip name to collection
                    return;
                }

                const activities = await getAllActivity(viewTrip);

                const { documents } = activities;
                setRowData(documents);
            }
        }
       getActivities();

    }, [viewTrip, 
        showActivityDetail, //inelegant, but there is a chance that user has edited an activity since visiting the detail bc workflow. 
    ])

    //this has to do with antd form initialvalue setting. If called inside the reviewer, it may not set properly on mount.
    useEffect(()=> {
        async function getTripReviewByUser(){
            if (viewTrip){

                if (ENV === "dev"){
                    if (sampleReviews.tripName === viewTrip) setTripReview(sampleReviews); //prod prefilters but here has to be forced
                    return;
                }

                const userReview = await getTripReviewForUser(viewTrip, user._id);

                const { document } = userReview; //singular: findOne
                setTripReview(document);
            }
        }
       getTripReviewByUser();

    }, [viewTrip, 
        reviewForm //on form exit, the original review retrieved is also removed

    ])

    return (
        <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: "transparent",
                  defaultHoverBg: "transparent",
                  defaultColor: "#00c28e",
                },
              },
            }}
          >
        <div className="activity-viewer">
            {/* <h1>Activity Viewer {user.displayName} {user.trips.find(trip => trip.tripName === viewTrip)!.role}</h1> */}
           
           { !showActivityDetail ? 

            !reviewForm ?
            
            (<>
                <div className="controls-activity">
              {/* {ENV === "dev" &&  <Button className="filter-btn" onClick={()=> setCategoryFilter("test")} shape="circle" ><SmileOutlined style={{color: "black"}} /></Button>} */}
                <Button className="filter-btn" onClick={()=> setCategoryFilter("activity")} size="large"  shape="circle" ><CarOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("food")} size="large"  shape="circle" ><img width={55} height={55} src={FoodOutlined} alt="food" /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("lodging")} size="large"  shape="circle"><HomeOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("prep")} size="large"  shape="circle"><img width={50} height={50} src={PrepOutlined} alt="preparations" /></Button> {/* more of a to-do list item, maybe V2*/}
               <Button className="filter-btn" onClick={()=> setCategoryFilter("")} size="large" disabled={disableClearBtn} shape="circle"><img width={45} height={45} src={ClearOutlined} alt="clear filter" /></Button>
                    
            </div>
            <div className="grid-title-box">
                <label className="titles">Activities {allowReview && <RightOutlined />}</label>
                {allowReview && <Button className="titles review" onClick={startReview}>
                    Review this trip</Button>}
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
            <>
                 <TripReviewer 
                    user={user}
                    viewTrip={viewTrip}
                    setReviewForm={setReviewForm}
                    allTripActivities={rowData}
                    tripReview={tripReview}
                    setTripReview={setTripReview}
                />
            </>
           )
           : (
            
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
        </ConfigProvider>
    )
}

export default ActivityViewer;