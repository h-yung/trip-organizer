import { Navigate, Route, Routes } from "react-router-dom";
// import AppHeader from './components/Header/Header';
import ActivityDetail from "./components/activityDetail/ActivityDetail";
import ActivityEntry from "./components/activityDetail/activityEntryForm";
import UpdateActivityEntry from "./components/activityDetail/activityUpdateForm";
import ActivityViewer from "./components/ActivityViewer/activityViewer"; // = homepg?
import ExpenseEntry from "./components/ExpenseViewer/expenseForm";
import ExpenseViewer from "./components/ExpenseViewer/expenseViewer";
import TripReviewer from "./components/TripReviewer/tripReviewer";

//none: User Home

import { PropsWithChildren, useState } from "react";
import "./App.scss";

import { useStorage } from "./authentication/useStorage";
import HelpPage from "./components/Help/Help";
import AppLayout from "./components/Layout/Layout";
import LoginPage from "./components/Login/Login";
import NoPage from "./components/noPage/NoPage";
import TripSelection from "./TripSelection/TripSelection";
import { ActionItem, TripReview } from "./utils/interfaces";
import { UserContext, useUserContext } from "./utils/UserContext";
// import UserUpdateCreate from './components/UserUpdateOrCreate/userUpdateCreate';

const ENV = import.meta.env.VITE_MODE;

const PrivateRoute = ({ children }: PropsWithChildren) => {
	const { activeUsr } = useUserContext();

	const auth = activeUsr;

	return auth ? children : <Navigate to="/login" />;
};

function App() {
	const [activeUsr, setActiveUsr] = useStorage("activeUsr");
	const [viewTrip, setViewTrip] = useStorage("viewTrip");

	const [selectedActivity, setSelectedActivity] = useStorage("selected");

	const [tripReview, setTripReview] = useState<TripReview | null>(null);
	const [rowData, setRowData] = useState<ActionItem[]>([]);

	return (
		<UserContext.Provider
			value={{
				activeUsr,
				viewTrip,
				setActiveUsr,
				setViewTrip,
				rowData,
				setRowData,
				selectedActivity,
				setSelectedActivity,
			}}
		>
			<Routes>
				<Route
					path="/"
					element={<AppLayout selectedActivity={selectedActivity} />}
				>
					<Route
						index
						element={
							!activeUsr ? (
								<Navigate to="/login" />
							) : (
								<Navigate to="/trip" />
							)
						}
					/>

					<Route path="login" element={<LoginPage />} />

					<Route
						path="trip"
						element={<PrivateRoute children={<TripSelection />} />}
					/>

					<Route
						path="trip/:tripName/activity"
						element={
							<PrivateRoute
								children={
									<ActivityViewer
										tripReview={tripReview}
										setTripReview={setTripReview}
										rowData={rowData}
										setRowData={setRowData}
									/>
								}
							/>
						}
					/>

					<Route
						path="trip/:tripName/activity/detail/:activityId"
						element={
							<PrivateRoute
								children={
									<ActivityDetail
										setSelectedActivity={
											setSelectedActivity
										}
										selectedActivity={selectedActivity}
									/>
								}
							/>
						}
					/>

					{selectedActivity && (
						<Route
							path="trip/:tripName/activity/detail/:activityId/update"
							element={
								<UpdateActivityEntry
									selectedActivity={selectedActivity}
									setSelectedActivity={setSelectedActivity}
								/>
							}
						/>
					)}
					<Route
						path="trip/:tripName/activity/new"
						element={<ActivityEntry />}
					/>

					<Route
						path="trip/:tripName/expenses"
						element={<ExpenseViewer />}
					/>
					<Route
						path="trip/:tripName/expenses/new"
						element={<ExpenseEntry />}
					/>
					<Route
						path="trip/:tripName/review/edit"
						element={
							<TripReviewer
								allTripActivities={rowData}
								tripReview={tripReview}
								setTripReview={setTripReview}
							/>
						}
					/>
					<Route
						path="help"
						element={
							!activeUsr ? <Navigate to="/login" /> : <HelpPage />
						}
					/>

					<Route path="*" element={<NoPage />} />
				</Route>

				{/* <Route
					path="*"
					element={<UserSelection setUser={setActiveUsr} />}
				/> */}
				{/* </Route> */}
			</Routes>
		</UserContext.Provider>
	);
}

export default App;
