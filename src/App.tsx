import { act, useEffect, useMemo, useState } from 'react'
import { Button, } from 'antd'
import { getAllActivity } from './apis/main';
import UserSelection from './components/UserSelection/userSelection';
import './App.css'
import './App.scss'
import { TripRecord, User } from './utils/interfaces';
import AppHeader from './components/Header/Header';
import ActivityViewer from './components/ActivityViewer/activityViewer';


function App() {
  const [activeUsr, setActiveUsr] = useState<User | null>(null);
  const [viewTrip, setViewTrip] = useState("");

  const chooseTrip = (e:any) => {
    e.preventDefault();
    setViewTrip(e.currentTarget.id);
  }

  useEffect(()=> {
    console.log("activeUser changed", activeUsr?.displayName);
  }, [activeUsr])

  return (
    <>
    <AppHeader activeUsr={activeUsr} viewTrip={viewTrip} setViewTrip={setViewTrip} />
  
     {!activeUsr && (
      <>
        <UserSelection setUser={setActiveUsr} />
      </>
     )} 
     {activeUsr && (
        !viewTrip ? 
      <>
        <span className='titles'>Choose a trip</span>
        <div className="trip-list-container">
            {activeUsr.trips.map((trip:TripRecord) => {
              return <Button size="large" key={trip.tripName} id={trip.tripName} onClick={chooseTrip}>{trip.tripName}</Button>
            })}
        </div>
        </>
        : (
          <>
          <ActivityViewer user={activeUsr} viewTrip={viewTrip} />
          
          </>
        )
     )}
     <span>Icons from flaticon; Kiwi by Juicy Fish from <a href="https://thenounproject.com/browse/icons/term/kiwi/" target="_blank" title="Kiwi Icons">Noun Project</a> (CC BY 3.0)</span>
    </>
  )
}

export default App
