
import { useMemo, useState } from "react";
import { avatarDictionary } from "../../utils/avatars";
import { AvatarItem, User } from "../../utils/interfaces";
import "../UserSelection/userSelection.scss";
import { Button, ConfigProvider } from "antd";


interface UserUpdateCreateProps {
    activeUsr: User;
}

const UserUpdateCreate = ({
    activeUsr
}: UserUpdateCreateProps) => {

    const [updateOrCreate, setUpdateOrCreate] = useState(false);

    const currentAvatar = useMemo(()=> {
        return avatarDictionary.find(({ref}:AvatarItem)=> ref === activeUsr.avatarRef)?.svg;

    },[activeUsr]);

    return (
        <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultBg: "transparent",
              defaultHoverBg: "transparent",
              defaultColor: "#00c28e",
              colorLinkHover: "#00c28e",
            //   colorPrimary: "#00c28e"
            },
            
          },
        }}
      >
        <div className="user-change-container">


        {!updateOrCreate ? (
            <Button className='titles' onClick={()=>{setUpdateOrCreate(true)}}>
                Update or add user
            </Button>
        ): (

            <>
            <span className='titles'>This you:</span>
            <span>{activeUsr.displayName}</span>
            <div className="avatar-group"
                key={activeUsr._id} 
                id={activeUsr._id}
                >
                {currentAvatar && <img src={currentAvatar} 
                key={activeUsr._id} 
                className="avatar-img" alt="animal icon avatar"/> }
            </div>
            </>
        ) }    
         
            
            
            


{/* <div className="user-selection-ctr"></div> */}

        </div>
        </ConfigProvider>
    )
}

export default UserUpdateCreate;






