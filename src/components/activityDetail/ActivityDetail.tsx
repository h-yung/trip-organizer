import { ArrowRightOutlined, CarOutlined, DeleteOutlined, DollarOutlined, EditOutlined, FileAddOutlined, HomeOutlined, PushpinOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Popconfirm } from "antd";
import { useCallback, useState } from "react";
import { deleteActivity } from "../../apis/main";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { ActionItem, Category, User } from "../../utils/interfaces";
import "./activityDetail.scss";
import UpdateActivityEntry from "./activityUpdateForm";
import { Link, useNavigate } from "react-router-dom";

const ENV = import.meta.env.VITE_MODE;

interface ActivityDetailProps {
    setSelectedActivity: (p: null | ActionItem) => void;
    viewTrip: string;
	// setShowActivityDetail: (p: boolean) => void;
    selectedActivity: ActionItem | null;
    // query: string; //global search
}

//dimensions vary...
const categoryIcon = (category:Category) => {
    switch (category){
        case "activity":
            return <CarOutlined style={{color: "black", fontSize: 30, width: 30}} />;
        case "food":
            return <img width={40} height={40} src={FoodOutlined} alt="food" />;
        case "lodging":
            return <HomeOutlined style={{color: "black", fontSize: 30, width: 30}} />;
        case "prep":
            return <PushpinOutlined style={{color: "black", fontSize: 30, width: 30}} />;
        case "test":
            return <SmileOutlined style={{color: "black", fontSize: 30, width: 30}} />;
    }
};

const ActivityDetail = (
    {setSelectedActivity, selectedActivity, viewTrip
        //  setShowActivityDetail, 
    }: ActivityDetailProps
) => {

    const navigate = useNavigate();

    const { title, startTime, location, advisory, details, vendor, urls } = selectedActivity!;

    const sendActivityToTrash = useCallback(async () => {
        if (ENV==="dev"){
            // setShowActivityDetail(false);
            console.log("dev: nah but back to main activity page");
            navigate(`/trip/${viewTrip}/activity`);
            return;
            
        }
        const response = await deleteActivity(selectedActivity!._id!);
        if (response.deletedCount){
            //go back to main page, which should get refreshed list
            setSelectedActivity(null);
            console.log("YAY DELETED SUCCESSFULLY");
            navigate(`/trip/${viewTrip}/activity`);
        }


    },[selectedActivity]);

    return (
        <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: "transparent",
                  defaultHoverBg: "transparent",
                  defaultColor: "#00c28e",
                  colorLinkHover: "#00c28e",
                //   colorPrimary: "#00c28e"
                },
                
              },
            }}
          >

<div className="detail-controls">
    <div 
    className="controls"
    >
      <Link to={`/trip/${viewTrip}/activity/detail/${selectedActivity?._id}/update`}><Button className="btn" 
      size="large"  style={{border: "none", fontSize: "2rem" }}><EditOutlined /></Button> 
      </Link>

     <Link className="exit-btn" to={`/trip/${viewTrip}/activity`} style={{width: 200}} >
     <span style={{fontSize:"1rem", textTransform: "uppercase" }}>Back </span><ArrowRightOutlined />
     </Link>
     </div>
</div>
    <div className="activity-detail-container">
      <div>
          <a className="bare-link" href={location.mapUrl} target="_blank"><h3>View Map</h3></a>
      </div>
            <div className="category-icon-detail">{ categoryIcon(selectedActivity!.category)}</div>
            
            <h2 style={{marginTop: "0.5rem"}}>{title}</h2>

              <div>
                  <label>Scheduled at</label>
                  <p>{startTime && new Date(startTime).toDateString()}</p>
              </div>
              <div>
                  <label>Location</label>
                  <p>{location.address} | { location.nearestCity } | { location.country } {location.zipcode && location.nearestState && `| ${location.nearestState} ${location.nearestState }`} </p>
              </div>
             {advisory && 
                  <div>
                  <label>Advisory</label>
                  <p>{advisory} </p>
              </div>
             } 
              {vendor && 
                  <div>
                  <label>Vendor</label>
                  <p>{vendor.name} {vendor.url && ` | ${vendor.url}`} </p>
                  {vendor.email && <p>{vendor.email}</p>}
                  {vendor.phoneNumber && <p>{vendor.phoneNumber}</p>}
              </div>
             } 
              {details && 
                  <div>
                  <label>Further Information</label>
                  <p>{details} </p>

                  <label>Links</label>
                  { urls?.length && urls[0] ? 
                  <ul>
                        {urls.map(url => {
                            return (
                                <li 
                                key={urls.indexOf(url)}
                                className="detail-urls"
                                ><a href={url}>{url}</a></li>
                            )
                        })
                        }
                        </ul>

                  : <></> }
              </div>
             } 
             <div>
             <Popconfirm title="Remove?"
                     onConfirm={sendActivityToTrash}
                     placement="bottom"
                >
                    <DeleteOutlined className="bin-btn"/>
                </Popconfirm>
             {/* <Link to={`/trip/${viewTrip}/activity`}><DeleteOutlined className="bin-btn" onClick={sendActivityToTrash}  /></Link>  */}
             {/* check operationally - this needs an async patch */}
             </div>
     </div>
           
        </ConfigProvider>
    )

};


export default ActivityDetail;
