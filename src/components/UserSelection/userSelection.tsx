
import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../../apis/main";
import { avatarDictionary } from "../../utils/avatars";
import { AvatarItem, User } from "../../utils/interfaces";
import bugs from "../../assets/bugs.svg";

import "./userSelection.scss";
import { sampleUsers } from "../../utils/sampleData";
import { Link } from "react-router-dom";

const ENV = import.meta.env.VITE_MODE;


interface UserSelectionProps {
    setUser: (p:User) => void;
}

const UserSelection = ({
    setUser
}: UserSelectionProps) => {
    const [userOptions, setUserOptions] = useState<User[]>([]);

    const assignUser = useCallback((event:any)=> {

        // event.preventDefault();
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
           setUserOptions(users.documents);
        }

        if (ENV === "dev"){
            setUserOptions(sampleUsers);
            return;
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
                            <Link to="/trip-selection"
                            key={_id} 
                                >
                                <div className="avatar-group"
                                id={_id}
                                onClick={assignUser}
                                role="button"
                                >
                                {svg && <img src={svg} 
                                key={_id} 
                                className="avatar-img" alt="animal icon avatar"/> }
                                <span
                                    style={{
                                        letterSpacing: "0.1rem",
                                        fontSize: "0.8rem",
                                        color:"black",
                                        textTransform: "uppercase"
                                    }}//scss not overriding link
                                >{displayName}</span>
                            </div>
                            </Link>
                        )
                    }
                )}
            </div>
           )}
        </div>
    )
}

export default UserSelection;






