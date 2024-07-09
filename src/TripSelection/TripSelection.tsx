import { ConfigProvider, Button } from "antd";
import { Image, TripRecord, User } from "../utils/interfaces";
import "./tripSelection.scss";
import { useEffect, useMemo, useState } from "react";
import { getAicArt } from "../apis/main";
import { Link, redirect } from "react-router-dom";

const ENV = import.meta.env.VITE_MODE;

interface TripSelectionProps {
    activeUsr: User;
    setViewTrip:(p:string) => void;
    setActiveUsr: (p: User | null) => void;

}

export default function TripSelection(
    {
        activeUsr,
        setViewTrip,
        setActiveUsr
    }:TripSelectionProps
    
) {
  const [artImg, setArtImg] = useState<Image | null>(null);

  const activeHasTrips:TripRecord[] = useMemo(()=>{
    return activeUsr.trips;

  } ,[activeUsr] )

    const chooseTrip = (e:any) => {
        const trip = e.currentTarget.id
        setViewTrip(trip);
        }

    useEffect(()=> {
        async function getArt(query?: string){  //currently "bear" default
            const artObj = await getAicArt(query);
            setArtImg(artObj);
        }

    if (ENV === "dev"){
        setArtImg({
        title: "Arty art Long Name Long NameLong Name Long NameLong Name Long NameLong Name Long Name",
        artist_title: "Artist Person Long Name Long Name Long Name Long Name",
        date_display: "1800-1815",
        image_id: "1001010101",
        alt_text: "test art image",
        url: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg"
        });
    } else {
        getArt(); //no query for now
    }
    }, []);

    return (
    
    <div className="trip-container">
        <span className='titles'>Choose a trip</span>
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

    {/* fix the order of ops user -> trip list -> choose -> unset user=unset viewtrip */}
        <div className="trip-list-container">
        
            {activeHasTrips.map((trip:TripRecord) => {
              return <div 
              key={trip.tripName}
              style={{display: "flex", alignItems: "center"}}
              >
                <Link to={`/trip/${trip.tripName}/activity`}><Button className="trip-item" size="large" id={trip.tripName} onClick={chooseTrip}>
                  {trip.tripName}
                </Button>
                </Link>
               
                </div>
            })}
        </div>
        <div style={{marginBottom: "2rem"}}>
          <Link to="/">
          <Button className='titles tertiary-btn'
            onClick={()=> setActiveUsr(null)}
          >Switch user?</Button>
          </Link>

        </div>
        </ConfigProvider>

    

        {/* <UserUpdateCreate activeUsr={activeUsr} /> */}

        {artImg && 
           <div className="art-aic-container">
              <div style={{width: "100vw", height: 300}}>
                <img src={artImg.url} alt={artImg?.alt_text} />
              </div>
              <div style={{width: "100vw", padding:"0 2rem"}}>
                <label>{artImg.title}</label>
                <p>{artImg.date_display} | {artImg.artist_title}</p>
                </div>
          </div>
          }
        
        </div>
      )
}