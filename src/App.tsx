import { DollarOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { getAicArt } from './apis/main';
import './App.scss';
import bugs from "./assets/bugs.svg";
import ClearOutlined from "./assets/noun-clear-4706196.svg";
import ActivityEntry from './components/activityDetail/activityEntryForm';
import ActivityViewer from './components/ActivityViewer/activityViewer';
import ExpenseViewer from './components/ExpenseViewer/expenseViewer';
import AppHeader from './components/Header/Header';
import UserSelection from './components/UserSelection/userSelection';
import { Image, TripRecord, User } from './utils/interfaces';
// import UserUpdateCreate from './components/UserUpdateOrCreate/userUpdateCreate';

const ENV = import.meta.env.VITE_MODE;


function App() {
  const [activeUsr, setActiveUsr] = useState<User | null>(
    
    ENV=== "dev" ? 
    {
      _id: "doot",
      displayName: "Test",
      lookupName: "app_developer",
      createdDate: "20240705",
      avatarRef: "bugs", //string
      avatar: bugs,
      trips: [{tripName: "test_trip_2024", role: "participant"}]
    } : null
  
  );
  const [viewTrip, setViewTrip] = useState(
    ENV=== "dev" ? 
    "test_trip_2024" : "" 
  );

  const [artImg, setArtImg] = useState<Image | null>(null);


  const [ showExpenseViewer, setShowExpenseViewer ] = useState(false);
  const [ showActEntry, setShowActEntry ] = useState(false); //maybe just set for editing similarily but pass a variable
  const [ help, setHelp ] = useState(false); 


  const chooseTrip = (e:any) => {
    e.preventDefault();
    setViewTrip(e.currentTarget.id);
  }

  const addActivity = () => {
    setShowExpenseViewer(false);
    setShowActEntry(true);
}

const showExpensesViewFromBtn = () => {
  setShowActEntry(false);
  setShowExpenseViewer(true);
}

  useEffect(()=> {
    console.log("activeUser changed", activeUsr?.displayName);
    
  }, [activeUsr])
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
    <
    //   div 
    // style={{display: "flex", flexDirection: "column", alignItems: "center",
    //   width:"100%",
    //   flex:1
    //   // height: "100vh"

    // }}
    >
    <AppHeader activeUsr={activeUsr} viewTrip={viewTrip} setViewTrip={setViewTrip} setHelp={setHelp} help={help} />
  <div className="main-app">

    { help && (
      <div className="help-box">
        <h2>Halp.</h2>
        <span>Lower right buttons:</span>
        <ul>
          <li>
            <FileAddOutlined className="help-icon"  /> Add new activity
          </li>
          <li>
            <DollarOutlined className="help-icon"  /> Expense report viewer
          </li>
          <li>
            <SearchOutlined className="help-icon"  /> *Global search (not yet functional HAHA)
          </li>
          <li>
          <img  className="help-icon" width={20} height={20} src={ClearOutlined} alt="exit ops" /> Close everything/return to activity list
          </li>
        </ul>
        <p>In Activities List: Double click to see activity detail. From detail page, you can edit or delete activity.</p>
        <p>In Expenses: Export CSV with the button at the bottom, or add a new expense. You can tap to enable deletion (tap on red bin 1x) or update existing expense (tap around elsewhere on the grid to get it to stop editing lol). It'll ask you to confirm your edits but deletes straight away. If you enter a new expense, notice you can add a few more fields than are currently shown.</p>
        <p>Click on the trip name in the header to choose a different trip.</p>
        <div style={{fontSize: "0.8rem", textAlign:"center"}}>
          <Divider type="horizontal"  />
          <span>Icons from <a href="https://www.flaticon.com/" target="_blank"> Flaticon</a> & <a href="https://thenounproject.com/browse/icons/term/kiwi/" target="_blank" title="Kiwi Icons">Noun Project</a> (CC BY 3.0). Art? from Art Institute of Chicago. | LCM</span>
        </div>
      </div>
    )}

  { showActEntry && activeUsr && viewTrip && (
    <ActivityEntry 
      setShowActEntry={setShowActEntry}
      user={activeUsr}
      viewTrip={viewTrip}
      />
  )}

{ showExpenseViewer && activeUsr && viewTrip && (
    <ExpenseViewer
      setShowExpenseViewer={setShowExpenseViewer}
      user={activeUsr}
      viewTrip={viewTrip}
      />
  )}

  { 
    !showActEntry && !showExpenseViewer && (
      !activeUsr ? (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <UserSelection setUser={setActiveUsr} />
        </div>
       ) : !viewTrip  ? 
        (<div className="trip-container">
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
          <div className="trip-list-container">
          
              {activeUsr.trips.map((trip:TripRecord) => {
                return <div 
                key={trip.tripName}
                style={{display: "flex", justifyContent: "center"}}
                
                ><Button className="trip-item" size="large" id={trip.tripName} onClick={chooseTrip}>{trip.tripName}</Button></div>
              })}
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
          : (
              <ActivityViewer user={activeUsr} viewTrip={viewTrip} />
            
        )
    )
  }
 
  </div>
     
     <div className="footer">

    { activeUsr && viewTrip && (

      <>
{ (showActEntry || showExpenseViewer) && <Button className="always-btn" shape="circle" onClick={() => { setShowActEntry(false); setShowExpenseViewer(false)}} size="large"><img width={60} height={60} src={ClearOutlined} alt="exit ops" /></Button>} 

{ !showActEntry && <Button className="always-btn" shape="circle" onClick={addActivity} size="large"><FileAddOutlined /></Button>} 


{ !showExpenseViewer && <Button className="always-btn" shape="circle" onClick={showExpensesViewFromBtn}><DollarOutlined /></Button> 
}
{/* <Button className="always-btn" shape="circle" onClick={()=> console.log("search")}><SearchOutlined /></Button> */}
      </>
    )}
     </div>
    
    </>
  )
}

export default App
