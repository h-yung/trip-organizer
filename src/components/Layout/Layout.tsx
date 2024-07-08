import { Link, Outlet, useLocation } from "react-router-dom";
import { User } from "../../utils/interfaces";
import AppHeader from "../Header/Header";
import { Button } from "antd";
import { CloseCircleOutlined, FileAddOutlined, DollarOutlined } from "@ant-design/icons";

interface AppLayoutProps {
    activeUsr: User | null;
    setActiveUsr:(p: User | null) => void;
    viewTrip: string;
    setViewTrip: (p:string) => void;
}

function AppLayout({
    activeUsr, viewTrip, setViewTrip, setActiveUsr
}:AppLayoutProps){
    const location = useLocation();

    return ( 
        <>
            <AppHeader 
            activeUsr={activeUsr} 
            setActiveUsr={setActiveUsr}
            viewTrip={viewTrip} 
            setViewTrip={setViewTrip} 
            />
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
            <Link to="/activity-update">Activity Update</Link>
          </li>
          <li>
            <Link to="/activity-new">Activity New</Link>
          </li>
          <li>
            <Link to="/trip-selection">Trip Selection</Link>
          </li>
          <li>
            <Link to="/trip-reviewer">Trip Reviewer</Link>
          </li>
        </ul>
      </nav> */}
      {/* <h2>Hello</h2> */}

        <div className="main-app">
            <Outlet />
        </div>
     

<div className="footer">

    { activeUsr && viewTrip && (
      <>
{/* (showActEntry || showExpenseViewer) && */}
{ location.pathname !== "/" && location.pathname !== "/expenses-new" && location.pathname !== "/activity-detail" &&
<Link to="/" >
    <Button className="always-btn" shape="circle" onClick={() => { 
    console.log("back to activities")
    }} size="large">
        <CloseCircleOutlined />
    </Button>
</Link> }


{ location.pathname !== "/activity-new" && location.pathname !== "/activity-update" && 
    <Link to="/activity-new">
        <Button className="always-btn" shape="circle" //onClick={(addActivity} size="large"
        >
            <FileAddOutlined />
        </Button>
    </Link> 
}

{ location.pathname !== "/expenses-viewer" &&
    <Link to="/expenses-viewer">
        <Button className="always-btn" shape="circle" 
        ><DollarOutlined /></Button>
    </Link>
}


{/* <Button className="always-btn" shape="circle" onClick={()=> console.log("search")}><SearchOutlined /></Button> */}
      </>
    )}
</div>
    
        </>
    )
}

export default AppLayout;