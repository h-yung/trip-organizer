import { CarOutlined, CloseCircleOutlined, DownOutlined, HomeOutlined, PushpinOutlined, StarFilled, UpOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Divider, Timeline } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { ActionItem, TripReview, User } from "../../utils/interfaces";
import { GridApi, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { getAllActivity, getTripReviewForUser } from "../../apis/main";
import "./activityViewer.scss";

import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { sampleActivities, sampleReviews } from "../../utils/sampleData";
import { actGridOptions, defaultColDefs, useColDefs } from "./gridConfig";

const ENV = import.meta.env.VITE_MODE;


interface ActivityViewerProps {
    user: User;
    viewTrip: string;
    setSelectedActivity: (p:ActionItem | null) => void;
    selectedActivity: ActionItem | null;
    tripReview: TripReview | null;
    setTripReview: (p:TripReview | null) => void;
    rowData: ActionItem[];
    setRowData: (p:ActionItem[]) => void;
}

const ActivityViewer = ({
    user,
    viewTrip,
    setSelectedActivity,
    tripReview,
    setTripReview,
    rowData,
    setRowData
}: ActivityViewerProps) => {

    const activityRef = useRef<GridApi<ActionItem>>(); //MutableRefObject<GridApi<ActionItem> | undefined >
    // const [showExpenseForm, setShowExpenseForm] = useState(false);
    // const [showActivityDetail, setShowActivityDetail] = useState(false);
    // const [selectedActivity, setSelectedActivity] = useState<ActionItem | null>(null);

    const [ categoryFilter, setCategoryFilter ] = useState(""); 
    const disableClearBtn = useMemo(()=> categoryFilter==="", [categoryFilter]);

    // const toggleFormVisibility = () => { setShowExpenseForm(!showExpenseForm)};

    const onGridReady = (params:GridReadyEvent) => { activityRef.current = params.api; };
    const columnDefs = useColDefs(setSelectedActivity);

    const allowReview = useMemo(()=>{
      //if user was a trip participant
      return user?.trips.find(trip => trip.tripName === viewTrip)?.role.includes("participant");
    },[viewTrip])


    const onTimelineItemClicked = useCallback((e:React.MouseEvent<HTMLDivElement>)=> {
        //get the correct data
        e.preventDefault();
        // console.log(e.currentTarget)
        const matchedDatum = rowData.find(datum => datum._id === e.currentTarget.id)!;
        console.log(matchedDatum)
        setSelectedActivity(matchedDatum);
		// setShowActivityDetail(true);
    },[rowData])

    //timeline
    const [reverse, setReverse] = useState(false);
    const toggleReverse = useCallback(()=> {
        setReverse(!reverse);
    }, [reverse])
    const timelineItems = useMemo(()=> {
        return rowData.sort((a,b)=> dayjs(b.startTime).diff(dayjs(a.startTime))).map((datum:ActionItem)=> {
            return ({
                label: dayjs(datum.startTime).format("ddd MMM DD h:mm A"),
                children: 
                <div key={datum._id} id={datum._id} onClick={onTimelineItemClicked} role="button">
                    <Link to="/activity-detail">
                        <h4 className="activity-title">{datum.title}</h4>
                        <span className="subtitle">{datum.location.nearestCity}</span>
                    </Link>
                </div>,
            })
        })
    },[rowData])


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

    }, [viewTrip

        //Trigger based on something else - TODO - FIX BELOW
        // showActivityDetail, //inelegant, but there is a chance that user has edited an activity since visiting the detail bc workflow.
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
        //FIND DIFFERENT TRIGGER TO RERUN TO GET UPDATES
        // reviewForm //on form exit, the original review retrieved is also removed

    ])

    return (
        <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: "transparent",
                  defaultHoverBg: "transparent",
                  defaultColor: "#00c28e",
                  defaultBorderColor:"#00c28e",
                },
                Timeline: {
                    colorPrimary: "#00c28e",
                    itemPaddingBottom: 48
                }
              },
            }}
          >
<div className="activity-viewer">
            {/* <h1>Activity Viewer {user.displayName} {user.trips.find(trip => trip.tripName === viewTrip)!.role}</h1> */}

    <div className="timeline-container">

        <>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                
                <div style={{display:"flex", flexDirection: "column", alignItems: "flex-start"}}>
                <span className="titles timeline">Schedule</span>

                
                    <span className="subtitle"> {rowData.length ? "Tap on activity names for details." : "There are no activities/events for this trip."}</span>
                </div>
            
            {rowData.length ? <Button className="timelline-btn" onClick={toggleReverse}>
            { reverse ? <UpOutlined />: <DownOutlined /> }
                </Button> : <></>}
            </div>
            
            
            <Timeline
            mode="left"
            items={timelineItems}
            reverse={reverse}
            /> 
            <div style={{display:"flex", justifyContent: "center", width: "100%"}}>
                {allowReview && <Link to="/trip-reviewer"><Button className="titles review" //onClick={startReview} 
                icon={<StarFilled />}>
                { !tripReview ? "Review this trip" : "Edit trip review"}</Button>
                </Link>}
            </div>
            
        </>
                    
        <Divider type="horizontal" />
                
        </div>
        <div className="controls-activity">
                {/* {ENV === "dev" &&  <Button className="filter-btn" onClick={()=> setCategoryFilter("test")} shape="circle" ><SmileOutlined style={{color: "black"}} /></Button>} */}
                <Button className="filter-btn" onClick={()=> setCategoryFilter("activity")} size="large"  shape="circle" ><CarOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("food")} size="large"  shape="circle" ><img style={{objectFit: "contain"}} width={48} height={48} src={FoodOutlined} alt="food" /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("lodging")} size="large"  shape="circle"><HomeOutlined style={{color: "black"}} /></Button>
                <Button className="filter-btn" onClick={()=> setCategoryFilter("prep")} size="large"  shape="circle"><PushpinOutlined style={{color: "black"}} /></Button> {/* more of a to-do list item, maybe V2*/}
                <Button className="filter-btn" onClick={()=> setCategoryFilter("")} size="large" disabled={disableClearBtn} shape="circle"><CloseCircleOutlined style={{color: "black"}} /></Button>
                    
        </div>
        <div className="grid-title-box">
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
        
    </div>

        </ConfigProvider>
    )
}

export default ActivityViewer;