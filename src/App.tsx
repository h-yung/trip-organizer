import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import AppHeader from './components/Header/Header';
import ActivityDetail from './components/activityDetail/ActivityDetail';
import ActivityEntry from './components/activityDetail/activityEntryForm';
import UpdateActivityEntry from './components/activityDetail/activityUpdateForm';
import ActivityViewer from './components/ActivityViewer/activityViewer'; // = homepg?
import ExpenseEntry from './components/ExpenseViewer/expenseForm';
import ExpenseViewer from './components/ExpenseViewer/expenseViewer';
import TripReviewer from './components/TripReviewer/tripReviewer';

//none: Help page/module; TripSelection, Home layout (permanent nav header)

import { useState } from 'react';
import './App.scss';
import bugs from "./assets/bugs.svg";

import HelpPage from './components/Help/Help';
import AppLayout from './components/Layout/Layout';
import NoPage from './components/noPage/NoPage';
import TripSelection from './TripSelection/TripSelection';
import { ActionItem, TripReview, User } from './utils/interfaces';
import UserSelection from './components/UserSelection/userSelection';
import ActivityMap from './components/activityDetail/activityDetailMap';
import UserContext from './utils/UserProvider';
import LoginPage from './components/Login/Login';
// import UserUpdateCreate from './components/UserUpdateOrCreate/userUpdateCreate';

const ENV = import.meta.env.VITE_MODE;


function App() {
  const [activeUsr, setActiveUsr] = useState<User | null>(null);
  const [viewTrip, setViewTrip] = useState("");

  const [selectedActivity, setSelectedActivity] = useState<ActionItem | null>(null);

  const [tripReview, setTripReview] = useState<TripReview | null>(null);
  const [rowData, setRowData] = useState<ActionItem[]>([]);


  return (

    <UserContext.Provider value={{
      activeUsr, 
      viewTrip, 
      setActiveUsr, 
      setViewTrip
      }} >
    <BrowserRouter>
      <Routes>
      <Route path="/" element={
        <AppLayout 
          activeUsr={activeUsr} 
          setActiveUsr={setActiveUsr}
          viewTrip={viewTrip} 
          setViewTrip={setViewTrip} 
        />
        }>

<Route index element={<UserSelection setUser={setActiveUsr} />} />

<Route path="login" element={<LoginPage />} /> 

<Route path="trip" element={<TripSelection />} />

            {/* Rewrite conditional to be handled by router/redirect or within module. */}
            {activeUsr && 
            
  <Route path="trip/:tripName/activity" element={<ActivityViewer 
      selectedActivity={selectedActivity}
      setSelectedActivity={setSelectedActivity}
      tripReview={tripReview}
      setTripReview={setTripReview}
      rowData={rowData}
      setRowData={setRowData}
    />} />}

    <Route path="trip/:tripName/activity/detail/:activityId" element={
              <ActivityDetail 
                setSelectedActivity={setSelectedActivity} 
                selectedActivity={selectedActivity} 
                />} />

        {selectedActivity && <Route path="trip/:tripName/activity/detail/:activityId/update" element={<UpdateActivityEntry
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
            />} />}
      <Route path="trip/:tripName/activity/new" element={<ActivityEntry />} />

      <Route path="trip/:tripName/expenses" element={<ExpenseViewer />} /> 
      <Route path="trip/:tripName/expenses/new" element={<ExpenseEntry />} />
      <Route path="trip/:tripName/review/edit" element={<TripReviewer 
                    allTripActivities={rowData}
                    tripReview={tripReview}
                    setTripReview={setTripReview}
                />} />
      <Route path="help" element={<HelpPage />} />

      {/* <Route path="*" element={<NoPage />} /> */}
      <Route path="*" element={<UserSelection setUser={setActiveUsr} />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )

  
}

export default App;
