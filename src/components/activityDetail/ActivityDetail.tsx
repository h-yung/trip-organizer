import { useState } from "react";
import { ActionItem, User } from "../../utils/interfaces";
import { getAicArt } from "../../apis/main";
import { Button, ConfigProvider } from "antd";
import "./activityDetail.scss";
import { EditOutlined, ArrowRightOutlined, FileAddOutlined } from "@ant-design/icons";
import ClearOutlined from "../../assets/noun-clear-4706196.svg";


interface ActivityDetailProps {
    setSelectedActivity: (p: null | ActionItem) => void;
	setShowActivityDetail: (p: boolean) => void;
    selectedActivity: ActionItem | null;
    user: User;
    // query: string; //global search
}

const ActivityDetail = (
    {setSelectedActivity, selectedActivity, setShowActivityDetail
        // , user
    }: ActivityDetailProps
) => {

    const [ editing, setEditing ] = useState(false);

    const { title, startTime, location, advisory, details, vendor } = selectedActivity!;

    const leave = () => {
        setEditing(false);
        setSelectedActivity(null);
        setShowActivityDetail(false);
    }


   

    // useEffect(()=> {
    //     async function getArt(query?: string){  //currently "bear" default
    //         const artObj = await getAicArt(query);
    //         setArtImg(artObj);
    //     }
    //     getArt(); //no query for now
    // }, []);

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
        <div className="activity-detail-container">
          <div className="detail-controls">
            {/* {!editing ? <Button className="btn" onClick={()=> setEditing(true)} size="large"  shape="circle" ><EditOutlined style={{color: "black"}} /></Button> 
            :
            <Button className="btn" onClick={()=> setEditing(false)} size="large"  shape="circle" ><img width={45} height={45} src={ClearOutlined} alt="exit editing mode" /></Button> } */}
                
           {/* need one more button to save? or confirm */}
           {/* need button to exit everything: always rightmost */}

           <Button className="exit-btn" onClick={leave} size="large" style={{width: 200}} ><span style={{fontSize:"1rem", textTransform: "uppercase", }}>Back </span><ArrowRightOutlined /></Button>
            </div>
            <div>
                <a className="bare-link" href={location.mapUrl} target="_blank"><h3>View Map</h3></a>
            </div>

            { !editing ? (
                <>
                   
                    <h2>{title}</h2>

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
                    </div>
                   } 
                </>
            ) : (
                <>
                   <span>Provide a form for editing + submission with conf.</span>
        </>
            )}
           
        </div>
        </ConfigProvider>
    )

};


export default ActivityDetail;
