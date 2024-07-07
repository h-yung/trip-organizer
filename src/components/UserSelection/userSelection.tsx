
import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../../apis/main";
import { avatarDictionary } from "../../utils/avatars";
import { AvatarItem, User } from "../../utils/interfaces";
import "./userSelection.scss";


interface UserSelectionProps {
    setUser: (p:User) => void;
}

const UserSelection = ({
    setUser
}: UserSelectionProps) => {
    const [userOptions, setUserOptions] = useState<User[]>([]);

    const assignUser = useCallback((event:any)=> {

        event.preventDefault();
        const activeUser = userOptions.find((opt:User)=> opt._id === event.currentTarget.id);

        // console.log(userOptions.map(usr => usr._id))
        

        if (activeUser){
            console.log("New active user")

            activeUser.avatar = avatarDictionary.find(({ref}:AvatarItem)=> ref === activeUser?.avatarRef)?.svg;

            setUser(activeUser);
        }

    }, [userOptions]);

    useEffect(()=> {
        async function getUsers(){
           const users = await getAllUsers();

           console.log("all the users")
           console.log()
           setUserOptions(users.documents);
        }

        getUsers();
    },[])


    return (
        <div className="user-selection-container">
            <span className='titles'>Who are you?</span>

           {userOptions.length && (
            <div className="user-selection-ctr">
                {userOptions.map(
                    ({_id, displayName, avatarRef}:User)=> {

                        const svg = avatarDictionary.find(({ref}:AvatarItem)=> ref === avatarRef)?.svg;
                        return (
                            <div className="avatar-group"
                                key={_id} 
                                id={_id}
                                onClick={assignUser}
                                role="button"
                                >
                                {svg && <img src={svg} 
                                key={_id} 
                                className="avatar-img" alt="animal icon avatar"/> }
                                <span>{displayName}</span>
                            </div>
                        )
                    }
                )}
            </div>
           )}
        </div>
    )
}

export default UserSelection;






