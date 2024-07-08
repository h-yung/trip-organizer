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
      trips: [
        {tripName: "test_trip_2024", role: ["participant"]},
        {tripName: "super_long_trip_name_hello", role: ["participant", "admin"]},
        {tripName: "third_trip", role: ["readOnly"]}
      ]
    } : null
  
  );
  const [viewTrip, setViewTrip] = useState(
    ENV=== "dev" ? 
    "test_trip_2024" : "" 
  );

  const [selectedActivity, setSelectedActivity] = useState<ActionItem | null>(null);

  const [tripReview, setTripReview] = useState<TripReview | null>(null);
  const [rowData, setRowData] = useState<ActionItem[]>([]);


  return (
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

          {/* Rewrite conditional to be handled by router/redirect or within module. */}
          {activeUsr && viewTrip && <Route index element={<ActivityViewer 
                user={activeUsr} 
                viewTrip={viewTrip} 
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                tripReview={tripReview}
                setTripReview={setTripReview}
                rowData={rowData}
                setRowData={setRowData}
              />} />}

          {/* <Route path="/user-selection" element={<UserSelection setUser={setActiveUsr} />} /> */}

        {activeUsr && selectedActivity && 
                  <Route path="activity-detail" element={
                  
                  <ActivityDetail 
                    setSelectedActivity={setSelectedActivity} 
                    selectedActivity={selectedActivity} 
                    />} />}
        {viewTrip && <Route path="expenses-viewer" element={<ExpenseViewer
              viewTrip={viewTrip}
              />} />} 
              {/* above, we can assume there won't be a viewtrip without an active user */}

        {activeUsr && selectedActivity && <Route path="activity-update" element={<UpdateActivityEntry
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                user={activeUsr}
                viewTrip={viewTrip}
            />} />}
        {activeUsr &&<Route path="activity-new" element={<ActivityEntry 
                user={activeUsr}
                viewTrip={viewTrip}
                />} />}
        {activeUsr && <Route path="trip-selection" element={<TripSelection
            activeUsr={activeUsr}
            setViewTrip={setViewTrip}
          />} />}

       {activeUsr && viewTrip && <Route path="expenses-new" element={
            <ExpenseEntry 
            viewTrip={viewTrip}
            user={activeUsr}
          />
          } />}
          {activeUsr && viewTrip && <Route path="trip-reviewer" element={<TripReviewer 
                    user={activeUsr}
                    viewTrip={viewTrip}
                    allTripActivities={rowData}
                    tripReview={tripReview}
                    setTripReview={setTripReview}
                />} />}
          <Route path="help" element={<HelpPage />} />

          <Route path="*" element={<UserSelection setUser={setActiveUsr}  />} />
          {/* <Route path="*" element={<NoPage />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  )

  
}

export default App;
