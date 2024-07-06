import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { DollarOutlined, FileAddOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ClearOutlined from "./assets/noun-clear-4706196.svg";
import UserSelection from './components/UserSelection/userSelection';
import './App.css'
import './App.scss'
import { TripRecord, User, Image } from './utils/interfaces';
import AppHeader from './components/Header/Header';
import ActivityViewer from './components/ActivityViewer/activityViewer';
import ActivityEntry from './components/activityDetail/activityEntryForm';
import ExpenseViewer from './components/ExpenseViewer/expenseViewer';
import { getAicArt } from './apis/main';

const ENV = import.meta.env.VITE_MODE;


function App() {
  const [activeUsr, setActiveUsr] = useState<User | null>(
    
    ENV=== "dev" ? 
    {
      _id: "doot",
      displayName: "Test",
      lookupName: "helen_yung",
      createdDate: "20240705",
      avatarRef: "bugs", //string
      trips: [{tripName: "destiny_alaska_2024", role: "participant"}]
    } : null
  
  );
  const [viewTrip, setViewTrip] = useState(
    ENV=== "dev" ? 
    "destiny_alaska_2024" : "" 
  );

  // const [artImg, setArtImg] = useState<Image | null>(null);


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
//   useEffect(()=> {
//     async function getArt(query?: string){  //currently "bear" default
//         const artObj = await getAicArt(query);
//         setArtImg(artObj);
//     }
//     getArt(); //no query for now
// }, []);

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
        <p>In Activities List: Double click to see activity detail. In Expenses: Export CSV with the button at the bottom, or add a new expense. Click on the trip name in the header to choose a different trip.</p>
        <p>*Delete/modify activities/expenses to come.</p>
        <div style={{fontSize: "0.5rem"}}>
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
          {/* {artImg && 
             <div className="art-aic-container">
                <div style={{width: 300, height: 250, margin: "0.5rem 0.5rem 0px 0px" }}><img src={artImg.url} alt={artImg?.alt_text} /></div>
                <div >
                  <label>{artImg.title}</label>
                  <span> | {artImg.date_display} | {artImg.artist_title}</span>
                </div>
                
            </div>
            } */}
        </div>
       ) : !viewTrip  ? 
        (<>
          <span className='titles'>Choose a trip</span>
          <div className="trip-list-container">
          
              {activeUsr.trips.map((trip:TripRecord) => {
                return <Button className="trip-item" size="large" key={trip.tripName} id={trip.tripName} onClick={chooseTrip}>{trip.tripName}</Button>
              })}
          </div>
          {/* {artImg && 
             <div className="art-aic-container">
                <div style={{width: 400, height: 300, //margin: "0.5rem 0.5rem 0px 0px" 
                }}><img src={artImg.url} alt={artImg?.alt_text} /></div>
                  <label>{artImg.title}</label>
                  <p>{artImg.date_display} | {artImg.artist_title}</p>
            </div>
            } */}
          
          </>)
          : (

            <>
              <ActivityViewer user={activeUsr} viewTrip={viewTrip} />
            </>
          )
    )
  }
 
  </div>
     
     <div className="footer">

    { activeUsr && viewTrip && (

      <>
{ (showActEntry || showExpenseViewer) && <Button className="always-btn" shape="circle" onClick={() => { setShowActEntry(false); setShowExpenseViewer(false);}} size="large"><img width={60} height={60} src={ClearOutlined} alt="exit ops" /></Button>} 

{ !showActEntry && <Button className="always-btn" shape="circle" onClick={addActivity} size="large"><FileAddOutlined /></Button>} 


{ !showExpenseViewer && <Button className="always-btn" shape="circle" onClick={showExpensesViewFromBtn}><DollarOutlined /></Button> 
}
<Button className="always-btn" shape="circle" onClick={()=> console.log("search")}><SearchOutlined /></Button>
      </>
    )}
     </div>
    
    </div>
  )
}

export default App
