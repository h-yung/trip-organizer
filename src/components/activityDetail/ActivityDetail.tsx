import { ArrowRightOutlined, CarOutlined, DeleteOutlined, EditOutlined, HomeOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { useCallback, useState } from "react";
import { deleteActivity } from "../../apis/main";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import PrepOutlined from "../../assets/noun-notes-6829221.svg";
import { ActionItem, Category, User } from "../../utils/interfaces";
import "./activityDetail.scss";
import UpdateActivityEntry from "./activityUpdateForm";

const ENV = import.meta.env.VITE_MODE;

interface ActivityDetailProps {
    setSelectedActivity: (p: null | ActionItem) => void;
	setShowActivityDetail: (p: boolean) => void;
    selectedActivity: ActionItem | null;
    user: User;
    viewTrip: string;
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
            return <img width={40} height={40} src={PrepOutlined} alt="preparations" />;
        case "test":
            return <SmileOutlined style={{color: "black", fontSize: 30, width: 30}} />;
    }
};

const ActivityDetail = (
    {setSelectedActivity, selectedActivity, setShowActivityDetail, user, viewTrip
    }: ActivityDetailProps
) => {

    const [ editing, setEditing ] = useState(false);

    const { title, startTime, location, advisory, details, vendor, urls } = selectedActivity!;

    const leave = () => {
        setEditing(false);
        setSelectedActivity(null);
        setShowActivityDetail(false);
    }

    const sendActivityToTrash = useCallback(async () => {
        if (ENV==="dev"){
            setShowActivityDetail(false);
        }
        const response = await deleteActivity(selectedActivity!._id!);
        if (response.deletedCount){
            //go back to main page, which should get refreshed list
            setShowActivityDetail(false);
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

{ !editing ? (
    <div className="activity-detail-container">
    <div className="detail-controls">
      <Button className="btn" onClick={()=> setEditing(true)} size="large"  style={{border: "none", fontSize: "2rem" }}><EditOutlined /></Button> 

     <Button className="exit-btn" onClick={leave} size="large" style={{width: 200}} ><span style={{fontSize:"1rem", textTransform: "uppercase", }}>Back </span><ArrowRightOutlined /></Button>
      </div>
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
                  { urls.length && urls[0] ? 
                  <ul style={{paddingLeft:"1rem"}}>
                        {urls.map(url => {
                            return (
                                <li key={urls.indexOf(url)}><a href={url}>{url}</a></li>
                            )
                        })
                        }
                        </ul>


                  : <></> }
              </div>
             } 
             <div>
             <DeleteOutlined role="button" className="bin-btn" onClick={sendActivityToTrash}  />
             </div>
     </div>
        ) : (

            <>
            {selectedActivity && <UpdateActivityEntry
                editing={editing}
                setEditing={setEditing}
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                user={user}
                viewTrip={viewTrip}
            /> } 
            </>
            
        )}
        
           
        </ConfigProvider>
    )

};


export default ActivityDetail;
