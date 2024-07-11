import "./Header.scss";
import { User } from '../../utils/interfaces';
import { useContext, useMemo } from "react";
import { Button, ConfigProvider, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../../utils/UserProvider";     

interface AppHeaderProps {
    activeUsr: User | null;
    viewTrip: string;
    setViewTrip: (p:string) => void;
    setActiveUsr: (p: User | null) => void;

}
const AppHeader = ({
  // activeUsr, 
  // viewTrip, 
  // setViewTrip

}: AppHeaderProps) => {

  const { activeUsr, viewTrip, setViewTrip } = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();

    const showName = useMemo(()=> activeUsr?.displayName.split(" ")[0],[activeUsr])

    const confirm = () => {
        setViewTrip("");
        // setActiveUsr(null);
        console.log("active user", activeUsr)
        console.log("viewtrip set to ull, redirecting")
        navigate("/trip");  
    }

    // const startReview = () => {
    //   setReviewForm(true);
    // }

    return (
        <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: "transparent",
                  defaultHoverBg: "transparent",
                //   defaultColor: "#00c28e",
                },
              },
            }}
          >
            <div className="header-container">
                {!activeUsr  && <span className="titles">Hallo</span>}
                
               { activeUsr &&

              // <Popconfirm title="Switch user?"
              //   onConfirm={switchUser}
              //   placement="bottom"
              //   >
                <div className='avatar-group'>
                    {activeUsr.avatar && 
                    <img src={activeUsr.avatar} 
                        className="avatar-img" alt="animal icon avatar"/> }
                    <span className="titles">{showName}</span>
                </div>
                // </Popconfirm>
              }
                
                <Popconfirm title="See a different trip?"
                     onConfirm={confirm}
                     placement="bottom"
                >
                    <div role="button" className="trip-name-container">{viewTrip}</div>
                </Popconfirm>
                 {location.pathname !== "/help" ? 
                 <Link to="/help" className="help-btn">
                    <QuestionCircleOutlined />
                  </Link>
                  :
                  // <Button className="help-btn">
                    <QuestionCircleOutlined
                      className="help-btn"
                      role="button"
                      onClick={ ()=> navigate(-1)}
                    />
                  // </Button>
                 }
            </div>
            </ConfigProvider>
    )
}

export default AppHeader;
