import {
	CloseCircleOutlined,
	DollarOutlined,
	FileAddOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../../utils/UserContext";
import AppHeader from "../Header/Header";
import { ActionItem } from "../../utils/interfaces";

interface AppLayoutProps {
	selectedActivity: ActionItem | null;
}

function AppLayout({ selectedActivity }: AppLayoutProps) {
	const location = useLocation();
	const { activeUsr, viewTrip } = useUserContext();

	return (
		<>
			<AppHeader />
			{/* <nav style={{marginTop: 50}}>
        <ul>
          <li>
            <Link to="/">ActivityViewer</Link>
          </li>
          <li>
            <Link to="/expenses-viewer">ExpensesViewer</Link>
          </li>
          <li>
            <Link to="/expenses-new">Expenses New</Link>
          </li>
          <li>
            <Link to="/activity/update">Activity Update</Link>
          </li>
          <li>
            <Link to="/activity-new">Activity New</Link>
          </li>
          <li>
            <Link to="/trip">Trip Selection</Link>
          </li>
          <li>
            <Link to={`/trip/${viewTrip}/review/edit`}>Trip Reviewer</Link>
          </li>
        </ul>
      </nav> */}
			{/* <h2>Hello</h2> */}

			<div className="main-app">
				<Outlet />
			</div>

			<div className="footer">
				{activeUsr && viewTrip && (
					<>
						{/* (showActEntry || showExpenseViewer) && */}

						{location.pathname !== `/trip/${viewTrip}/activity` &&
							location.pathname !==
								`/trip/${viewTrip}/expenses/new` && (
								// !(location.pathname.includes("detail") && location.pathname.includes("activity")) &&
								//only show this button if currently NOT: activity viewer, new expense entry, or activity detail
								<Link to={`/trip/${viewTrip}/activity`}>
									<Button
										className="always-btn"
										shape="circle"
										onClick={() => {
											console.log("back to activities");
										}}
										size="large"
									>
										<CloseCircleOutlined />
									</Button>
								</Link>
							)}

						{
							//fix this
							location.pathname !==
								`/trip/${viewTrip}/activity/new` &&
								location.pathname !==
									`/trip/${viewTrip}/review/edit` &&
								location.pathname !==
									`/trip/${viewTrip}/activity/detail/${selectedActivity?._id}` && (
									<Link to={`/trip/${viewTrip}/activity/new`}>
										<Button
											className="always-btn"
											shape="circle" //onClick={(addActivity} size="large"
										>
											<FileAddOutlined />
										</Button>
									</Link>
								)
						}

						{location.pathname !== `/trip/${viewTrip}/expenses` && (
							<Link to={`trip/${viewTrip}/expenses`}>
								<Button className="always-btn" shape="circle">
									<DollarOutlined />
								</Button>
							</Link>
						)}

						{/* <Button className="always-btn" shape="circle" onClick={()=> console.log("search")}><SearchOutlined /></Button> */}
					</>
				)}
			</div>
		</>
	);
}

export default AppLayout;
