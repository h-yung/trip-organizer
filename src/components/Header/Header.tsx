import "./Header.scss";
import { User } from '../../utils/interfaces';
import { useMemo } from "react";
import { Popconfirm } from "antd";

interface AppHeaderProps {
    activeUsr: User | null;
    viewTrip: string;
    setViewTrip: (p:string) => void;
}
const AppHeader = ({activeUsr, viewTrip, setViewTrip}: AppHeaderProps) => {

    const showName = useMemo(()=> activeUsr?.displayName.split(" ")[0],[activeUsr])

    const confirm = () => {
        setViewTrip("");
    }


    return (
        // <Header>
            <div className="header-container">
                {activeUsr ? <div className='avatar-group'>
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
            </div>
        // </Header>
    )
}

export default AppHeader;
