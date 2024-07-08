import "./Header.scss";
import { User } from '../../utils/interfaces';
import { useMemo } from "react";
import { Button, ConfigProvider, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface AppHeaderProps {
    activeUsr: User | null;
    viewTrip: string;
    setViewTrip: (p:string) => void;
    setHelp: (p:boolean) => void;
    help: boolean;

    //must reset everything when trip is swapped
    setShowExpenseViewer: (p:boolean) => void;
    setShowActEntry:(p:boolean) => void;
    setReviewForm:(p:boolean) => void;


}
const AppHeader = ({
  activeUsr, viewTrip, setViewTrip, setHelp, help,
  setShowActEntry,
  setShowExpenseViewer,
  setReviewForm

}: AppHeaderProps) => {

    const showName = useMemo(()=> activeUsr?.displayName.split(" ")[0],[activeUsr])

    const confirm = () => {
        setViewTrip("");
        setShowActEntry(false);
        setShowExpenseViewer(false);
        setReviewForm(false);
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
                {activeUsr ? 
                <div className='avatar-group'>
                    {activeUsr.avatar && 
                    <img src={activeUsr.avatar} 
                        className="avatar-img" alt="animal icon avatar"/> }
                    <span className="titles">{showName}</span>
                </div> : <span className="titles">Hai there</span>}
                <Popconfirm title="See a different trip?"
                     onConfirm={confirm}
                     placement="bottom"
                >
                    <div role="button" className="trip-name-container">{viewTrip}</div>
                </Popconfirm>
                <Button className="help-btn" onClick={()=>{setHelp(!help)}}><QuestionCircleOutlined /></Button>
            </div>
            </ConfigProvider>
    )
}

export default AppHeader;
